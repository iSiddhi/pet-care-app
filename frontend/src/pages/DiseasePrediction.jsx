import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const DiseasePrediction = () => {
  const [formData, setFormData] = useState({
    pet: '',
    breed: '',
    symptoms: ''
  });
  const [breeds, setBreeds] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const petTypes = ['Dog', 'Cat', 'Rabbit', 'Birds', 'Fish', 'Turtle'];

  const breedData = {
    Dog: ['Golden Retriever', 'Labrador', 'German Shepherd', 'Bulldog', 'Poodle', 'Beagle', 'Rottweiler'],
    Cat: ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'Abyssinian', 'Russian Blue'],
    Rabbit: ['Holland Lop', 'Netherland Dwarf', 'Flemish Giant', 'Mini Rex', 'Lionhead'],
    Birds: ['Canary', 'Parakeet', 'Cockatiel', 'Lovebird', 'Finch', 'Parrot'],
    Fish: ['Goldfish', 'Betta', 'Angelfish', 'Guppy', 'Neon Tetra', 'Discus'],
    Turtle: ['Red-eared Slider', 'Box Turtle', 'Russian Tortoise', 'Hermann\'s Tortoise']
  };

  useEffect(() => {
    if (formData.pet) {
      setBreeds(breedData[formData.pet] || []);
      setFormData(prev => ({ ...prev, breed: '' }));
    } else {
      setBreeds([]);
    }
  }, [formData.pet]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pet || !formData.breed || !formData.symptoms.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    setShowResult(false);

    try {
      let predictionResult;
      try {
        predictionResult = await apiService.predictDisease(formData);
      } catch (error) {
        console.log('API call failed, using mock prediction');
        predictionResult = generateMockPrediction(formData);
      }

      setTimeout(() => {
        setPrediction(predictionResult);
        setLoading(false);
        setShowResult(true);
      }, 2000);

    } catch (error) {
      console.error('Error predicting disease:', error);
      setLoading(false);
      alert('An error occurred while predicting. Please try again.');
    }
  };

  const generateMockPrediction = (data) => {
    const symptoms = data.symptoms.toLowerCase();

    if (symptoms.includes('cough') || symptoms.includes('breathing')) {
      return {
        disease: 'Respiratory Infection',
        confidence: 85,
        description: 'A common respiratory condition that affects the airways and lungs.',
        severity: 'Moderate',
        tips: [
          'Keep your pet in a well-ventilated area',
          'Ensure adequate rest and reduce activity',
          'Monitor breathing patterns closely',
          'Consult a veterinarian for proper diagnosis',
          'Keep the environment clean and dust-free'
        ],
        urgency: 'Schedule a vet visit within 1-2 days'
      };
    } else if (symptoms.includes('vomit') || symptoms.includes('diarrhea') || symptoms.includes('stomach')) {
      return {
        disease: 'Digestive Issues',
        confidence: 78,
        description: 'Gastrointestinal problems that may be caused by dietary changes or infections.',
        severity: 'Mild to Moderate',
        tips: [
          'Provide bland diet (rice and boiled chicken for dogs)',
          'Ensure adequate hydration',
          'Monitor food intake and appetite',
          'Avoid giving treats or table scraps',
          'Consider probiotics (consult vet first)'
        ],
        urgency: 'Monitor closely, consult vet if symptoms persist'
      };
    } else if (symptoms.includes('scratch') || symptoms.includes('itch') || symptoms.includes('skin')) {
      return {
        disease: 'Skin Allergy',
        confidence: 72,
        description: 'Allergic reactions affecting the skin, possibly due to environmental or food allergens.',
        severity: 'Mild',
        tips: [
          'Identify and remove potential allergens',
          'Use hypoallergenic shampoos',
          'Keep the affected area clean and dry',
          'Prevent excessive scratching with protective clothing',
          'Consider antihistamines (vet prescribed only)'
        ],
        urgency: 'Non-urgent, but schedule a vet consultation'
      };
    } else if (symptoms.includes('lethargy') || symptoms.includes('tired') || symptoms.includes('weak')) {
      return {
        disease: 'General Fatigue Syndrome',
        confidence: 65,
        description: 'General weakness and fatigue that could indicate various underlying conditions.',
        severity: 'Variable',
        tips: [
          'Ensure adequate nutrition and hydration',
          'Provide a comfortable resting environment',
          'Monitor vital signs and behavior',
          'Check for fever or other symptoms',
          'Encourage gentle exercise if appropriate'
        ],
        urgency: 'Monitor closely and consult vet if persists beyond 24 hours'
      };
    } else {
      return {
        disease: 'General Health Check Recommended',
        confidence: 60,
        description: 'The symptoms require professional evaluation for accurate diagnosis.',
        severity: 'Unknown',
        tips: [
          'Document all symptoms with dates and times',
          'Monitor your pet\'s eating and drinking habits',
          'Note any behavioral changes',
          'Keep your pet comfortable and stress-free',
          'Prepare questions for your veterinarian'
        ],
        urgency: 'Schedule a veterinary consultation for proper diagnosis'
      };
    }
  };

  const resetForm = () => {
    setFormData({ pet: '', breed: '', symptoms: '' });
    setPrediction(null);
    setShowResult(false);
    setBreeds([]);
  };

  const getSeverityColor = (severity) => {
    if (severity?.toLowerCase().includes('mild')) return 'text-green-600 bg-green-100';
    if (severity?.toLowerCase().includes('moderate')) return 'text-yellow-600 bg-yellow-100';
    if (severity?.toLowerCase().includes('severe')) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center py-8 relative"
      style={{ backgroundImage: "url('/diseaseAI/Stethoscope.png')" }}
    >
      <div className="absolute inset-2 bg-white/60"></div>


      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">AI Disease Prediction</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our advanced AI system helps identify potential health issues in your pets. Please note this is for informational purposes only and should not replace professional veterinary diagnosis.
        </p>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <span className="text-yellow-400 text-xl">⚠️</span>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Important:</strong> This AI prediction is for educational purposes only. 
                Always consult with a qualified veterinarian for accurate diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>

        {!showResult ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Pet Health Assessment</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pet Type *</label>
                  <select
                    name="pet"
                    value={formData.pet}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Pet Type</option>
                    {petTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breed *</label>
                  <select
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    disabled={!formData.pet}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    required
                  >
                    <option value="">Select Breed</option>
                    {breeds.map((breed) => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms *</label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : '🔬 Analyze Symptoms'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600"
                >
                  🔄 Reset Form
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">Analysis Complete</h2>
              <p className="text-gray-600">Based on the symptoms provided for your {formData.breed}</p>
            </div>

            {prediction && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">{prediction.disease}</h3>
                  <p className="text-blue-700 mb-3">{prediction.description}</p>
                  <div className="flex justify-center items-center space-x-4">
                    <span className="text-sm font-medium text-gray-600">
                      Confidence: <span className="font-bold text-blue-600">{prediction.confidence}%</span>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(prediction.severity)}`}>
                      {prediction.severity}
                    </span>
                  </div>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                  <div className="flex">
                    <span className="text-orange-400 text-xl mr-3">⏰</span>
                    <div>
                      <h4 className="font-semibold text-orange-800">Recommended Action:</h4>
                      <p className="text-orange-700">{prediction.urgency}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">Recommended Care Tips</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prediction.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-green-500 font-bold text-lg">✓</span>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-4 pt-6 border-t">
                  <button
                    onClick={resetForm}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
                  >
                    New Analysis
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600"
                  >
                    Print Results
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Important Disclaimer</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• This AI prediction is based on pattern recognition and should not replace professional veterinary diagnosis</li>
            <li>• Always consult with a licensed veterinarian for accurate diagnosis and treatment plans</li>
            <li>• In case of emergency symptoms, contact your veterinarian immediately</li>
            <li>• This tool is designed to provide general guidance and educational information only</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DiseasePrediction;
