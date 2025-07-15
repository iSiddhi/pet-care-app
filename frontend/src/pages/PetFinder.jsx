import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAppContext } from '../context/AppContext';

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
    { id: 1, type: 'Dog', breed: 'Golden Retriever', price: 800, age: '2 years', characteristics: ['Friendly', 'Active'], image: '/PetServices/Dog1.png' },
    { id: 2, type: 'Dog', breed: 'Labrador', price: 700, age: '1 year', characteristics: ['Loyal', 'Gentle'], image: '/PetServices/Dog2.png' },
    { id: 3, type: 'Dog', breed: 'German Shepherd', price: 900, age: '3 years', characteristics: ['Intelligent', 'Protective'], image: '/PetServices/Dog3.png' },
    { id: 4, type: 'Cat', breed: 'Persian', price: 600, age: '2 years', characteristics: ['Calm', 'Beautiful'], image: '/PetServices/cat1.png' },
    { id: 5, type: 'Cat', breed: 'Siamese', price: 500, age: '1 year', characteristics: ['Social', 'Vocal'], image: '/PetServices/cat2.png' },
    { id: 6, type: 'Rabbit', breed: 'Holland Lop', price: 200, age: '6 months', characteristics: ['Gentle', 'Small'], image: '/PetServices/rabbit1.png' },
    { id: 7, type: 'Birds', breed: 'Canary', price: 150, age: '1 year', characteristics: ['Musical', 'Colorful'], image: '/PetServices/birds1.png' },
    { id: 8, type: 'Fish', breed: 'Goldfish', price: 50, age: '6 months', characteristics: ['Peaceful', 'Easy Care'], image: '/PetServices/fish1.png' },
    { id: 9, type: 'Turtle', breed: 'Red-eared Slider', price: 100, age: '1 year', characteristics: ['Quiet', 'Long-lived'], image: '/PetServices/turtle1.png' }
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

        {/* Filter Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pet Type</label>
              <select
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select Pet Type</option>
                {petTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
              <select
                value={selectedBreed}
                onChange={(e) => setSelectedBreed(e.target.value)}
                disabled={!selectedPet || breeds.length === 0}
                className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
              >
                <option value="">Select Breed</option>
                {breeds.map((breed) => (
                  <option key={breed} value={breed}>{breed}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="w-full mb-2"
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

          <div className="flex justify-center space-x-4 mt-6">
            <button onClick={handleSearch} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">🔍 Find Pets</button>
            <button onClick={resetFilters} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">🔄 Reset</button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for perfect pets...</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8 text-gray-800">
              Found {results.length} perfect match{results.length !== 1 ? 'es' : ''}! 🎉
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((pet) => (
                <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg">
                  <img src={pet.image} alt={pet.breed} className="w-full h-48 object-contain bg-white" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{pet.breed}</h3>
                    <p className="text-gray-600 mb-1"><strong>Type:</strong> {pet.type}</p>
                    <p className="text-gray-600 mb-2"><strong>Age:</strong> {pet.age}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pet.characteristics.map((char, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{char}</span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">${pet.price}</span>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Contact Seller</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && results.length === 0 && (selectedPet || selectedBreed || priceRange[0] > 0 || priceRange[1] < 1000) && (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">😔</div>
            <h2 className="text-xl font-semibold">No pets found</h2>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria.</p>
            <button onClick={resetFilters} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Reset Filters</button>
          </div>
        )}

        {!loading && results.length === 0 && !selectedPet && !selectedBreed && priceRange[0] === 0 && priceRange[1] === 1000 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">🐾</div>
            <h2 className="text-xl font-semibold">Start Your Search</h2>
            <p className="text-gray-600">Use the filters above to find your perfect pet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetFinder;
