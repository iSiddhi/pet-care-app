const asyncHandler = require('../middleware/asyncHandler');
const Disease = require('../models/Disease');
const { askGemini, isAIEnabled, getActiveModel } = require('../utils/aiClient');
const { checkMessage } = require('../utils/petTopicGuard');
const { getSiteContext } = require('../utils/siteContext');

const VET_DISCLAIMER =
  'This is an AI-assisted suggestion, not a veterinary diagnosis. Please consult a licensed vet before acting on it.';

// ---------- Rule-based fallback (also grounds the AI answer) ----------
const matchDiseases = async (petType, symptomText) => {
  const text = (symptomText || '').toLowerCase();
  const candidates = await Disease.find(
    petType ? { petTypes: petType } : {}
  );

  return candidates
    .map((d) => {
      const hits = d.symptomKeywords.filter((k) => text.includes(k.toLowerCase()));
      return { disease: d, hits: hits.length, matched: hits };
    })
    .filter((r) => r.hits > 0)
    .sort((a, b) => b.hits - a.hits);
};

const toPrediction = (row, confidence) => ({
  disease: row.disease.name,
  severity: row.disease.severity,
  description: row.disease.description,
  recommendations: row.disease.recommendations,
  seeVetIf: row.disease.seeVetIf,
  matchedSymptoms: row.matched,
  confidence,
});

// @route  POST /api/predict-disease   body: { pet, breed, symptoms }
// @access Public
exports.predictDisease = asyncHandler(async (req, res) => {
  const { pet, breed, symptoms } = req.body;

  if (!pet || !symptoms) {
    res.status(400);
    throw new Error('pet and symptoms are required');
  }

  const matches = await matchDiseases(pet, symptoms);
  const topMatches = matches.slice(0, 3);

  // Give Gemini the DB shortlist so it reasons over real data instead of
  // inventing conditions from scratch.
  const context = topMatches.length
    ? topMatches
        .map(
          (m) =>
            `- ${m.disease.name} (${m.disease.severity}): ${m.disease.description} | typical signs: ${m.disease.symptomKeywords.join(', ')}`
        )
        .join('\n')
    : 'No close match in the local knowledge base.';

  const aiText = await askGemini(
    `Pet type: ${pet}\nBreed: ${breed || 'unknown'}\nReported symptoms: ${symptoms}\n\n` +
      `Shortlist from our database:\n${context}\n\n` +
      `Return JSON with keys: disease (string), severity (one of Low/Moderate/High/Critical), ` +
      `description (2 sentences), recommendations (array of 3-5 short strings), ` +
      `seeVetIf (one sentence), confidence (number 0-100).`,
    {
      systemInstruction:
        'You are a cautious veterinary triage assistant. Never give a definitive diagnosis. ' +
        'Prefer conditions from the provided shortlist when they fit. Always advise professional care for severe signs.',
      json: true,
    }
  );

  if (aiText) {
    try {
      const parsed = JSON.parse(aiText);
      return res.json({
        success: true,
        source: 'ai',
        prediction: { ...parsed, disclaimer: VET_DISCLAIMER },
        alternatives: topMatches.slice(1).map((m) => toPrediction(m, null)),
      });
    } catch {
      // Malformed JSON from the model -- fall through to rules
    }
  }

  if (topMatches.length === 0) {
    return res.json({
      success: true,
      source: 'rules',
      prediction: {
        disease: 'Unclear',
        severity: 'Moderate',
        description:
          'The described symptoms do not clearly match a known condition in our database.',
        recommendations: [
          'Monitor eating, drinking and energy levels for 24 hours',
          'Note any new or worsening symptoms with times',
          'Keep your pet warm, hydrated and rested',
          'Book a vet consultation if anything worsens',
        ],
        seeVetIf: 'Symptoms persist beyond 24 hours or worsen at any point.',
        confidence: 0,
        disclaimer: VET_DISCLAIMER,
      },
      alternatives: [],
    });
  }

  const best = topMatches[0];
  const confidence = Math.min(95, Math.round((best.hits / Math.max(1, best.disease.symptomKeywords.length)) * 100));

  res.json({
    success: true,
    source: 'rules',
    prediction: { ...toPrediction(best, confidence), disclaimer: VET_DISCLAIMER },
    alternatives: topMatches.slice(1).map((m) => toPrediction(m, null)),
  });
});

// ---------- Chatbot ----------
const MOCK_REPLIES = [
  "I'd recommend a vet-approved, age-appropriate food for your pet's nutritional needs.",
  'For a dog with skin allergies, try a limited ingredient diet and consult your vet.',
  'Cats typically need annual wellness exams with your veterinarian.',
  'The best exercise for your dog depends on their breed, age, and health status.',
  'Puppies should be socialized between 3-14 weeks of age for best results.',
  'Regular grooming helps prevent matting and skin issues in long-haired pets.',
  'Fish tanks should be cleaned partially and regularly to keep healthy bacteria.',
  'Feel free to book a grooming appointment through our services page!',
];

// @route  POST /api/chatbot   body: { message, history? }
// @access Public
// api.js reads response.data.reply
exports.chat = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || !message.trim()) {
    res.status(400);
    throw new Error('message is required');
  }

  // Gate first. An off-topic question costs nothing this way -- the model
  // would otherwise bill us for the tokens just to decline.
  const gate = checkMessage(message);
  if (!gate.allow) {
    return res.json({
      success: true,
      source: 'guard',
      reason: gate.reason,
      reply: gate.reply,
    });
  }

  const transcript = history
    .slice(-6)
    .map((h) => `${h.role === 'bot' ? 'Assistant' : 'User'}: ${h.text}`)
    .join('\n');

  // Cached, rebuilt every 10 min -- keeps stock claims honest
  const siteContext = await getSiteContext();

  const reply = await askGemini(
    `${transcript ? `Conversation so far:\n${transcript}\n\n` : ''}User: ${message}`,
    {
      systemInstruction:
        `You are Myaau, the assistant on the Pet Care Hub website. ` +
        `Here is everything about the site you work for:\n\n${siteContext}\n\n` +
        `RULES:\n` +
        `- Answer ONLY about pets (health, symptoms, breeds, food, grooming, training) ` +
        `and this website's own services, stock, prices and pages.\n` +
        `- When asked what we have or what something costs, use the figures above. ` +
        `Never invent stock, prices, breeds or staff that are not listed.\n` +
        `- If we genuinely do not stock something, say so plainly and suggest the closest thing we do have.\n` +
        `- Point people to the right page by name when it helps ` +
        `(for example "you can filter by budget on the Pet Finder page").\n` +
        `- If a question is not about pets or this site, reply exactly: ` +
        `"I can only help with pet care topics." and nothing more.\n` +
        `- Keep answers under 70 words. Warm, practical, no filler.\n` +
        `- For any medical concern, recommend seeing a vet.\n` +
        `- Prices are in US dollars as shown on the site.`,
      maxOutputTokens: 260,
    }
  );

  res.json({
    success: true,
    source: reply ? 'ai' : 'mock',
    reply: reply || MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)],
  });
});

// @route  GET /api/ai/status
exports.aiStatus = (req, res) =>
  res.json({
    success: true,
    aiEnabled: isAIEnabled(),
    configuredModel: process.env.GEMINI_MODEL || '(auto)',
    activeModel: getActiveModel(),
  });
