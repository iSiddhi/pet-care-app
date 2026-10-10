const { GoogleGenerativeAI } = require('@google/generative-ai');

// Model IDs move fast. The configured one is tried first; if Google has
// retired it (404 / "not found"), we fall through the list instead of
// silently dropping every AI call until someone edits .env.
const FALLBACK_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
];

let genAI = null;
let activeModel = null; // remembered once a model answers successfully

const client = () => {
  if (genAI) return genAI;
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  genAI = new GoogleGenerativeAI(key);
  return genAI;
};

const isAIEnabled = () => Boolean(process.env.GEMINI_API_KEY);

const candidates = () => {
  if (activeModel) return [activeModel];
  const configured = process.env.GEMINI_MODEL;
  return [...new Set([configured, ...FALLBACK_MODELS].filter(Boolean))];
};

const isModelMissing = (err) => {
  const msg = (err?.message || '').toLowerCase();
  return msg.includes('not found') || msg.includes('404') ||
         msg.includes('not supported') || msg.includes('deprecated');
};

/**
 * Returns trimmed text, or null when AI is off or every attempt failed.
 * Callers must always keep a non-AI fallback path.
 */
const askGemini = async (prompt, { systemInstruction, json = false, maxOutputTokens = 800 } = {}) => {
  const ai = client();
  if (!ai) return null;

  for (const modelId of candidates()) {
    try {
      const model = ai.getGenerativeModel({ model: modelId });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        ...(systemInstruction && {
          systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
        }),
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens,
          ...(json && { responseMimeType: 'application/json' }),
        },
      });

      const text = result?.response?.text?.();
      if (text) {
        if (activeModel !== modelId) {
          activeModel = modelId;
          console.log(`Gemini: using model ${modelId}`);
        }
        return text.trim();
      }
    } catch (err) {
      if (isModelMissing(err)) {
        console.warn(`Gemini: model "${modelId}" unavailable, trying next`);
        continue;
      }
      console.error('Gemini call failed, falling back:', err.message);
      return null;
    }
  }

  console.error('Gemini: no usable model found. Check GEMINI_MODEL in .env');
  return null;
};

module.exports = { askGemini, isAIEnabled, getActiveModel: () => activeModel };
