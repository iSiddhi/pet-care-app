/**
 * Decides whether a chat message is worth sending to Gemini.
 *
 * The point is cost: a system prompt alone still bills you for every
 * off-topic question before the model declines it. This runs locally,
 * costs nothing, and only lets pet-related messages through.
 *
 * Bias: let borderline messages through. A wrongly blocked real question
 * is far worse than one wasted call.
 */

const MAX_LENGTH = 500;

// Anything clearly asking the model to do unrelated work.
// Checked first — these override topic words ("write python code for a dog game").
const OFF_TOPIC_PATTERNS = [
  /\b(write|generate|create|give me)\s+(me\s+)?(a\s+)?(code|script|program|function|essay|poem|song|story|blog|article|letter|resume|cv)\b/i,
  /\b(python|javascript|java|c\+\+|sql|html|css|react|node)\b.*\b(code|script|function|program|error|bug)\b/i,
  /\b(solve|calculate|compute)\b.*\b(equation|integral|derivative|matrix|sum of)\b/i,
  // "stock" alone is a false positive -- "is the cat carrier in stock" is a
  // perfectly good question. Require the financial sense explicitly.
  /\b(stock market|stocks|shares?|crypto|bitcoin|ethereum|invest(ing|ment)?|trading|share price|market cap|mutual fund)\b/i,
  /\b(election|president|prime minister|political party|government policy)\b/i,
  /\b(translate|summari[sz]e)\s+(this|the following|it)\b/i,
  /\b(who|what)\s+(is|are|was|were)\s+(the\s+)?(ceo|founder|capital|population|president)\b/i,
  /\b(recipe|cook|bake)\b(?!.*\b(dog|cat|pet|puppy|kitten|homemade pet)\b)/i,
  /\b(movie|film|song|album|netflix|game of thrones|football|cricket match)\b/i,
  /\bhomework\b/i,
];

// Questions about the site, the bot, or how things work here. These carry no
// pet vocabulary at all ("what can I do here?") but are exactly what a first
// time visitor asks, so they get an explicit pass.
const META_PATTERNS = [
  /\bwhat (is|are|does)\s+(this|it|the (site|website|page|app|service|company))\b/i,
  /\b(tell me|explain)\s+(about|more about)\s+(this|it|you|yourself|the (site|website|company))\b/i,
  /\bwhat (can|could|do)\s+(i|you|we)\s+(do|get|find|buy|book|ask)\b/i,
  /\bhow (does|do)\s+(this|it|you|the (site|website|ordering|booking|checkout))\s+work\b/i,
  /\bwhy (should|would)\s+i\s+(use|choose|pick|trust|buy)\b/i,
  /\bwhat (services|features|options|help)\b/i,
  /\b(are|is)\s+(you|this|it)\s+(free|safe|legit|real|trustworthy)\b/i,
  /\bhelp\b[\s!.?]*$/i,
  /\bwhat else\b/i,
  /\bhow (can|do) (i|you) (help|get started|start|begin)\b/i,
];

// Pet vocabulary. Broad on purpose.
const TOPIC_WORDS = [
  // animals
  'pet', 'pets', 'animal', 'dog', 'dogs', 'puppy', 'puppies', 'cat', 'cats',
  'kitten', 'kittens', 'rabbit', 'rabbits', 'bunny', 'bird', 'birds', 'parrot',
  'canary', 'budgie', 'cockatiel', 'parakeet', 'fish', 'aquarium', 'tank',
  'turtle', 'tortoise', 'hamster', 'guinea pig',
  // breeds
  'breed', 'breeds', 'retriever', 'labrador', 'beagle', 'bulldog', 'poodle',
  'german shepherd', 'rottweiler', 'persian', 'siamese', 'maine coon',
  'ragdoll', 'shorthair', 'abyssinian', 'husky', 'pug', 'dachshund',
  'betta', 'goldfish', 'guppy', 'angelfish', 'tetra', 'lop', 'rex', 'lionhead',
  // health
  'health', 'healthy', 'sick', 'ill', 'illness', 'disease', 'symptom', 'symptoms',
  'vet', 'veterinary', 'veterinarian', 'vaccine', 'vaccination', 'deworm',
  'medicine', 'medication', 'infection', 'allergy', 'allergies', 'itching',
  'scratching', 'vomit', 'vomiting', 'diarrhea', 'diarrhoea', 'fever', 'limping',
  'wound', 'injury', 'parasite', 'flea', 'fleas', 'tick', 'ticks', 'worms',
  'neuter', 'spay', 'pregnant', 'pregnancy', 'lifespan', 'weight', 'obesity',
  'dental', 'teeth', 'tooth', 'ear', 'eyes', 'skin', 'coat', 'fur', 'shedding',
  // care
  'food', 'feed', 'feeding', 'diet', 'nutrition', 'treat', 'treats', 'kibble',
  'groom', 'grooming', 'bath', 'bathe', 'brush', 'brushing', 'nail', 'nails',
  'trim', 'litter', 'cage', 'kennel', 'leash', 'collar', 'bedding', 'toy', 'toys',
  'train', 'training', 'behaviour', 'behavior', 'barking', 'biting', 'chewing',
  'walk', 'walking', 'exercise', 'socialize', 'socialise', 'adopt', 'adoption',
  'rescue', 'care', 'hygiene', 'temperature', 'water',
  // our services and site questions
  'booking', 'book', 'appointment', 'order', 'price', 'cost', 'delivery',
  'shipping', 'store', 'shop', 'essentials', 'consultant', 'service', 'services',
  'sell', 'stock', 'available', 'availability', 'offer', 'buy', 'purchase',
  'checkout', 'cart', 'bag', 'payment', 'refund', 'return', 'account',
  'sign in', 'login', 'register', 'hours', 'open', 'contact', 'location',
  'website', 'site', 'page', 'groomer', 'groomers', 'team', 'gallery',
];

// Cheap canned answers. These never reach the API at all.
const CANNED = [
  {
    match: /^(hi|hello|hey|yo|namaste|hola|good (morning|afternoon|evening))\b[\s!.?]*$/i,
    reply: "Hi! I'm Myaau. Ask me anything about pet health, breeds, food, grooming or training.",
  },
  {
    match: /^(thanks|thank you|thx|ty|great|nice|cool|ok|okay|got it)\b[\s!.?]*$/i,
    reply: "Happy to help. Anything else about your pet?",
  },
  {
    match: /^(bye|goodbye|see you|cya)\b[\s!.?]*$/i,
    reply: "Take care — and give your pet a scratch from me.",
  },
  {
    match: /\b(who are you|what are you|your name|what can you do)\b/i,
    reply:
      "I'm Myaau, the pet care assistant here. I can help with pet health and symptoms, " +
      "breed questions, food and nutrition, grooming, training, and our services.",
  },
];

const OFF_TOPIC_REPLY =
  "I can only help with pet care — health and symptoms, breeds, food, grooming, " +
  "training, and our services. Ask me something about your pet and I'm all yours.";

/**
 * @returns {{ allow: boolean, reply?: string, reason?: string }}
 *   allow:false means answer with `reply` and never call the model.
 */
const checkMessage = (raw) => {
  const text = (raw || '').trim();

  if (!text) {
    return { allow: false, reply: 'Ask me something about your pet.', reason: 'empty' };
  }

  if (text.length > MAX_LENGTH) {
    return {
      allow: false,
      reply: `That's a long one. Could you shorten it to under ${MAX_LENGTH} characters so I can help properly?`,
      reason: 'too_long',
    };
  }

  const canned = CANNED.find((c) => c.match.test(text));
  if (canned) return { allow: false, reply: canned.reply, reason: 'canned' };

  const lower = text.toLowerCase();

  // Explicit off-topic requests lose even if they mention a pet word
  if (OFF_TOPIC_PATTERNS.some((p) => p.test(text))) {
    return { allow: false, reply: OFF_TOPIC_REPLY, reason: 'off_topic_pattern' };
  }

  // Questions about the site itself, before the vocabulary check
  if (META_PATTERNS.some((p) => p.test(text))) {
    return { allow: true, reason: 'meta_question' };
  }

  // Word-boundary match so "cat" doesn't fire on "category" or "education"
  const hit = TOPIC_WORDS.some((w) =>
    new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?\\b`, 'i').test(lower)
  );
  if (hit) return { allow: true };

  // A short follow-up ("why?", "how often?", "and for puppies") only makes
  // sense against the previous turn, so let those through.
  if (text.split(/\s+/).length <= 6 && /\?$/.test(text)) {
    return { allow: true, reason: 'short_followup' };
  }

  return { allow: false, reply: OFF_TOPIC_REPLY, reason: 'no_topic_match' };
};

module.exports = { checkMessage, MAX_LENGTH, OFF_TOPIC_REPLY };
