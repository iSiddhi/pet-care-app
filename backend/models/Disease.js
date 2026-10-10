const mongoose = require('mongoose');

// Used as the rule-based knowledge base behind /api/predict-disease.
// Gemini is tried first; this is the fallback and the grounding source.
const diseaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    petTypes: { type: [String], default: [], index: true },
    // Lowercase keywords matched against the user's symptom text
    symptomKeywords: { type: [String], default: [] },
    severity: { type: String, enum: ['Low', 'Moderate', 'High', 'Critical'], default: 'Moderate' },
    description: { type: String, default: '' },
    recommendations: { type: [String], default: [] },
    seeVetIf: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Disease', diseaseSchema);
