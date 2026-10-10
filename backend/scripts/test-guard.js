/**
 * Regression check for the pet-topic gate.
 *   npm run test:guard
 *
 * Every blocked message is a Gemini call we never pay for. Every wrongly
 * blocked one is a user we failed, so add cases here when you tune the lists.
 */
const { checkMessage } = require('../utils/petTopicGuard');

const CASES = [
  // [message, shouldReachGemini]
  ['hi', false],
  ['hello there!', false],
  ['thanks', false],
  ['who are you', false],
  ['bye', false],

  ['My dog has been vomiting since yesterday', true],
  ['What are good breeds for a small apartment?', true],
  ['how often should I brush a persian cat', true],
  ['best food for a 3 month old puppy', true],
  ['my betta has white spots on its fins', true],
  ['is my rabbit eating enough hay', true],
  ['how much does grooming cost', true],
  ['can I book an appointment tomorrow', true],
  ['my parrot is plucking feathers', true],
  ['turtle shell looks soft', true],
  ['is the cat carrier in stock', true],
  ['what do you sell', true],
  ['do you have rabbits', true],
  ['what are your opening hours', true],
  ['who are your groomers', true],
  ['how do I checkout', true],

  // Meta questions -- no pet words at all, but exactly what new visitors ask
  ['what is this website', true],
  ['what do you do', true],
  ['what can I do here', true],
  ['how does this work', true],
  ['why should I use this', true],
  ['how do I get started', true],
  ['help', true],
  ['tell me about yourself', true],
  ['homemade recipe for dog treats', true],
  ['why?', true],
  ['how often?', true],

  ['write me a python script to sort a list', false],
  ['write python code for a dog game', false],
  ['who is the president of India', false],
  ['what is the capital of France', false],
  ['give me a recipe for pasta', false],
  ['explain quantum physics', false],
  ['bitcoin price prediction', false],
  ['write an essay about climate change', false],
  ['do my homework', false],
  ['translate this to spanish', false],
  ['solve this integral for me', false],
  ['best netflix shows right now', false],
  ['should I invest in stocks', false],
  ['stock market today', false],
  ['how does a car engine work', false],
  ['what is photosynthesis', false],
  ['x'.repeat(600), false],
  ['', false],
];

let pass = 0;
const failures = [];

for (const [message, expected] of CASES) {
  const { allow, reason } = checkMessage(message);
  const label = message.length > 50 ? `${message.slice(0, 47)}…` : message || '(empty)';

  if (allow === expected) {
    pass += 1;
    console.log(`  ok    ${String(allow).padEnd(5)} ${(reason || 'topic_match').padEnd(18)} ${label}`);
  } else {
    failures.push({ label, expected, got: allow, reason });
    console.log(`  FAIL  ${String(allow).padEnd(5)} ${(reason || 'topic_match').padEnd(18)} ${label}`);
  }
}

console.log(`\n${pass}/${CASES.length} passed`);

if (failures.length) {
  console.log('\nFailures:');
  failures.forEach((f) =>
    console.log(`  "${f.label}" — expected reachGemini=${f.expected}, got ${f.got} (${f.reason || 'topic_match'})`)
  );
  process.exit(1);
}

const blocked = CASES.filter(([, e]) => !e).length;
console.log(`${blocked} of ${CASES.length} messages blocked before any API call.\n`);
