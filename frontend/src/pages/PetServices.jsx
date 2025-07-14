import React, { useState } from 'react';
import { apiService } from '../services/api';
import { useAppContext } from '../context/AppContext';

const PetServices = () => {
  const { state, dispatch } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  const petCategories = [
    { type: 'Dog', icon: '🐕', color: 'bg-blue-100 border-blue-300' },
    { type: 'Cat', icon: '🐱', color: 'bg-green-100 border-green-300' },
    { type: 'Rabbit', icon: '🐰', color: 'bg-pink-100 border-pink-300' },
    { type: 'Birds', icon: '🦜', color: 'bg-yellow-100 border-yellow-300' },
    { type: 'Fish', icon: '🐠', color: 'bg-cyan-100 border-cyan-300' },
    { type: 'Turtle', icon: '🐢', color: 'bg-emerald-100 border-emerald-300' }
  ];
const mockImages = {
  Dog: ['/PetServices/Dog2.png', '/PetServices/Dog1.png', '/PetServices/Dog3.png'],
  Cat: ['/PetServices/cat1.png', '/PetServices/cat2.png', '/PetServices/cat3.png'],
  Rabbit: ['/PetServices/rabbit1.png', '/PetServices/rabbit2.png', '/PetServices/rabbit3.png'],
  Birds: ['/PetServices/birds1.png', '/PetServices/birds2.png', '/PetServices/birds3.png'],
  Fish: ['/PetServices/fish1.png', '/PetServices/fish2.png', '/PetServices/fish3.png'],
  Turtle: ['/PetServices/turtle1.png', '/PetServices/turtle2.png', '/PetServices/turtle3.png']
};


  const mockBreeds = {
    Dog: ['Golden Retriever', 'Labrador', 'Beagle'],
    Cat: ['Persian', 'Siamese', 'British Shorthair'],
    Rabbit: ['Holland Lop', 'Netherland Dwarf', 'Lionhead'],
    Birds: ['African Grey', 'Canary', 'Budgerigar'],
    Fish: ['Betta', 'Goldfish', 'Guppy'],
    Turtle: ['Red-Eared Slider', 'Box Turtle', 'Snapping Turtle']
  };

  const fetchPets = async (type) => {
    setLoading(true);
    try {
      let petData;
      try {
        petData = await apiService.getPetsByType(type);
      } catch (error) {
        const images = mockImages[type];
        const breeds = mockBreeds[type];
        petData = {
          pets: images.map((img, index) => ({
            id: `${type}-${index + 1}`,
            name: `${type} Breed ${index + 1}`,
            breed: breeds[index],
            characteristics: ['Friendly', 'Active', 'Healthy'],
            image: img,
            price: 500 + (index * 150),
            link: `/pets/${type.toLowerCase()}/${index + 1}`
          }))
        };
      }
      setPets(petData.pets || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (type) => {
    setSelectedCategory(type);
    fetchPets(type);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Pet Services</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover amazing pets by category. Browse through different types and find detailed information about breeds, characteristics, and prices.
        </p>

        {/* Category Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {petCategories.map((category) => (
            <button
              key={category.type}
              onClick={() => handleCategoryClick(category.type)}
              className={`${category.color} border-2 p-6 rounded-lg text-center hover:shadow-lg transition duration-300 transform hover:scale-105 ${
                selectedCategory === category.type ? 'ring-4 ring-blue-300' : ''
              }`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="text-lg font-semibold text-gray-700">{category.type}</h3>
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading pets...</p>
          </div>
        )}

        {/* Pet Grid */}
        {!loading && selectedCategory && pets.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">
              {selectedCategory} Collection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                >
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-64 object-contain bg-white"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{pet.name}</h3>
                    <p className="text-gray-600 mb-3">
                      <span className="font-medium">Breed:</span> {pet.breed}
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
                      <a
                        href={pet.link}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Selection */}
        {!selectedCategory && !loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🐾</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Select a Pet Category</h2>
            <p className="text-gray-600">Choose from the categories above to view available pets</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetServices;
