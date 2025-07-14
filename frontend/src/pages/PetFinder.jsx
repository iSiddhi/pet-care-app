import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAppContext } from '../context/AppContext';  
// import { actionTypes } from '../conte xt/AppContext';

const PetFinder = () => {
  const { state, dispatch } = useAppContext();
  const [selectedPet, setSelectedPet] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [breeds, setBreeds] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const petTypes = ['Dog', 'Cat', 'Rabbit', 'Birds', 'Fish', 'Turtle'];

  const allPets = [
    { id: 1, type: 'Dog', breed: 'Golden Retriever', price: 800, age: '2 years', characteristics: ['Friendly', 'Active'], image: 'https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=Golden+Retriever' },
    { id: 2, type: 'Dog', breed: 'Labrador', price: 700, age: '1 year', characteristics: ['Loyal', 'Gentle'], image: 'https://via.placeholder.com/200x200/059669/FFFFFF?text=Labrador' },
    { id: 3, type: 'Dog', breed: 'German Shepherd', price: 900, age: '3 years', characteristics: ['Intelligent', 'Protective'], image: 'https://via.placeholder.com/200x200/DC2626/FFFFFF?text=German+Shepherd' },
    { id: 4, type: 'Cat', breed: 'Persian', price: 600, age: '2 years', characteristics: ['Calm', 'Beautiful'], image: 'https://via.placeholder.com/200x200/7C3AED/FFFFFF?text=Persian+Cat' },
    { id: 5, type: 'Cat', breed: 'Siamese', price: 500, age: '1 year', characteristics: ['Social', 'Vocal'], image: 'https://via.placeholder.com/200x200/EA580C/FFFFFF?text=Siamese+Cat' },
    { id: 6, type: 'Rabbit', breed: 'Holland Lop', price: 200, age: '6 months', characteristics: ['Gentle', 'Small'], image: 'https://via.placeholder.com/200x200/0891B2/FFFFFF?text=Holland+Lop' },
    { id: 7, type: 'Birds', breed: 'Canary', price: 150, age: '1 year', characteristics: ['Musical', 'Colorful'], image: 'https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=Canary' },
    { id: 8, type: 'Fish', breed: 'Goldfish', price: 50, age: '6 months', characteristics: ['Peaceful', 'Easy Care'], image: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=Goldfish' },
    { id: 9, type: 'Turtle', breed: 'Red-eared Slider', price: 100, age: '1 year', characteristics: ['Quiet', 'Long-lived'], image: 'https://via.placeholder.com/200x200/6366F1/FFFFFF?text=Turtle' }
  ];

  useEffect(() => {
    if (selectedPet) {
      fetchBreeds(selectedPet);
    } else {
      setBreeds([]);
      setSelectedBreed('');
    }
  }, [selectedPet]);

  const fetchBreeds = async (petType) => {
    try {
      let breedData;
      try {
        breedData = await apiService.getBreedsByPet(petType);
      } catch (error) {
        const mockBreeds = {
          Dog: ['Golden Retriever', 'Labrador', 'German Shepherd', 'Bulldog', 'Poodle'],
          Cat: ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Ragdoll'],
          Rabbit: ['Holland Lop', 'Netherland Dwarf', 'Flemish Giant', 'Mini Rex'],
          Birds: ['Canary', 'Parakeet', 'Cockatiel', 'Lovebird', 'Finch'],
          Fish: ['Goldfish', 'Betta', 'Angelfish', 'Guppy', 'Neon Tetra'],
          Turtle: ['Red-eared Slider', 'Box Turtle', 'Russian Tortoise', 'Hermann\'s Tortoise']
        };
        breedData = { breeds: mockBreeds[petType] || [] };
      }
      setBreeds(breedData.breeds || []);
    } catch (error) {
      console.error('Error fetching breeds:', error);
      setBreeds([]);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    let filteredPets = allPets;

    if (selectedPet) {
      filteredPets = filteredPets.filter(pet => pet.type === selectedPet);
    }

    if (selectedBreed) {
      filteredPets = filteredPets.filter(pet => pet.breed === selectedBreed);
    }

    filteredPets = filteredPets.filter(pet =>
      pet.price >= priceRange[0] && pet.price <= priceRange[1]
    );

    setTimeout(() => {
      setResults(filteredPets);
      setLoading(false);
    }, 1000);
  };

  const resetFilters = () => {
    setSelectedPet('');
    setSelectedBreed('');
    setPriceRange([0, 1000]);
    setResults([]);
    setBreeds([]);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center py-8 backdrop-blur-sm bg-white/12"
      style={{ backgroundImage: "url('/bestpet/backk.png')" }}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Best Pet Finder</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Find your perfect companion! Use our smart filters to discover pets that match your preferences and budget.
        </p>

    

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pet Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Type
              </label>
              <select
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Pet Type</option>
                {petTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Breed Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Breed
              </label>
              <select
                value={selectedBreed}
                onChange={(e) => setSelectedBreed(e.target.value)}
                disabled={!selectedPet || breeds.length === 0}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Breed</option>
                {breeds.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              🔍 Find Pets
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition duration-300"
            >
              🔄 Reset Filters
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for perfect pets...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8 text-gray-800">
              Found {results.length} perfect match{results.length !== 1 ? 'es' : ''} for you! 🎉
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((pet) => (
                <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <img
                    src={pet.image}
                    alt={pet.breed}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{pet.breed}</h3>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Type:</span> {pet.type}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Age:</span> {pet.age}
                    </p>
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Characteristics:</p>
                      <div className="flex flex-wrap gap-2">
                        {pet.characteristics.map((char, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">${pet.price}</span>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                        Contact Seller
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && (selectedPet || selectedBreed || priceRange[0] > 0 || priceRange[1] < 1000) && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">😔</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No pets found</h2>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <button
              onClick={resetFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Initial State */}
        {!loading && results.length === 0 && !selectedPet && !selectedBreed && priceRange[0] === 0 && priceRange[1] === 1000 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🐾</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Ready to Find Your Perfect Pet?</h2>
            <p className="text-gray-600">Use the filters above to start your search</p>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Pet Selection Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Consider Your Space</h3>
              <p className="text-gray-600">Make sure your living space is suitable for your chosen pet</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Time Commitment</h3>
              <p className="text-gray-600">Different pets require different amounts of daily care and attention</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Budget Planning</h3>
              <p className="text-gray-600">Factor in ongoing costs like food, healthcare, and grooming</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetFinder;
