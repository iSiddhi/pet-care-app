/**
 * Checks the Gemini setup end to end, without needing the server running.
 *   npm run test:ai
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { askGemini, isAIEnabled, getActiveModel } = require('../utils/aiClient');

const ok = (m) => console.log(`  PASS  ${m}`);
const bad = (m) => console.log(`  FAIL  ${m}`);
const info = (m) => console.log(`        ${m}`);

(async () => {
  console.log('\nGemini configuration check\n' + '-'.repeat(46));

  // 1. Is a key present at all?
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    bad('GEMINI_API_KEY is empty in .env');
    info('Get one at https://aistudio.google.com/app/apikey');
    info('Then add it to backend/.env and run this again.');
    process.exit(1);
  }
  ok(`Key found (${key.slice(0, 6)}…${key.slice(-4)}, ${key.length} chars)`);

  // Two formats are in the wild: the older "AIza…" keys and the newer
  // AI Studio "AQ.…" keys. Only warn if it looks like neither.
  if (!/^(AIza|AQ\.)/.test(key)) {
    info('Heads up: this does not look like a Google API key (expected "AIza…" or "AQ.…").');
  }

  // 2. Does the key authenticate, and which models can it see?
  console.log('\nReachable models\n' + '-'.repeat(46));
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
    );
    const body = await res.json();

    if (!res.ok) {
      bad(`Google rejected the key (HTTP ${res.status})`);
      info(body?.error?.message || JSON.stringify(body).slice(0, 200));
      info('Common causes: key copied wrong, or the Generative Language API');
      info('is not enabled on that Google Cloud project.');
      process.exit(1);
    }

    const usable = (body.models || [])
      .filter((m) => (m.supportedGenerationMethods || []).includes('generateContent'))
      .map((m) => m.name.replace('models/', ''));

    ok(`Key is valid — ${usable.length} text models available`);

    const configured = process.env.GEMINI_MODEL;
    if (configured) {
      if (usable.includes(configured)) ok(`Configured model "${configured}" is available`);
      else {
        bad(`Configured model "${configured}" is NOT available`);
        info('The client will fall through to the next model in its list.');
      }
    }

    info('');
    info('First few you can use:');
    usable.slice(0, 8).forEach((m) => info(`  - ${m}`));
  } catch (err) {
    bad(`Could not reach Google: ${err.message}`);
    info('Check your internet connection or proxy.');
    process.exit(1);
  }

  // 3. A real generation call through the app's own client
  console.log('\nLive call (chatbot path)\n' + '-'.repeat(46));
  if (!isAIEnabled()) {
    bad('isAIEnabled() returned false — the app would use fallback replies');
    process.exit(1);
  }

  const reply = await askGemini('In one short sentence: how often should I brush a long-haired cat?', {
    systemInstruction: 'You are a concise pet care assistant. Under 30 words.',
  });

  if (!reply) {
    bad('askGemini returned null — the app would fall back to canned replies');
    info('Scroll up: the error from the attempt is printed above.');
    process.exit(1);
  }
  ok(`Model replied (${getActiveModel()})`);
  info(`"${reply}"`);

  // 4. JSON mode, which disease prediction depends on
  console.log('\nLive call (disease prediction path, JSON mode)\n' + '-'.repeat(46));
  const json = await askGemini(
    'Pet: Dog. Symptoms: vomiting and low energy since yesterday. ' +
    'Return JSON with keys: disease (string), severity (Low/Moderate/High/Critical), confidence (0-100).',
    { systemInstruction: 'You are a cautious veterinary triage assistant.', json: true }
  );

  if (!json) {
    bad('JSON-mode call failed — prediction would use the keyword fallback');
    process.exit(1);
  }

  try {
    const parsed = JSON.parse(json);
    ok('JSON mode works and parses');
    info(JSON.stringify(parsed, null, 2).split('\n').join('\n        '));
  } catch {
    bad('Model replied but the JSON did not parse');
    info(json.slice(0, 200));
    info('Not fatal — the controller catches this and uses the rule-based path.');
  }

  console.log('\nAll good. Chatbot and health check will use Gemini.\n');
  process.exit(0);
})();
