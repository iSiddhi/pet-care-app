import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { actionTypes } from '../context/AppContext';

const Essentials = () => {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('Dog');

  const essentialItems = {
    Dog: [
      {
        id: 1,
        name: 'Premium Dog Food',
        category: 'Food',
        price: 45.99,
        image: '/essentials/dog-food.jpeg',
        description: 'High-quality nutrition for adult dogs',
        inStock: true
      },
      {
        id: 2,
        name: 'Dog Leash & Collar Set',
        category: 'Accessories',
        price: 29.99,
        image: '/essentials/leash.png',
        description: 'Durable leash and collar combo',
        inStock: true
      },
      {
        id: 3,
        name: 'Dog Toys Bundle',
        category: 'Toys',
        price: 24.99,
        image: '/essentials/toys.png',
        description: 'Interactive toys for active play',
        inStock: false
      },
      {
        id: 4,
        name: 'Dog Bed - Large',
        category: 'Comfort',
        price: 79.99,
        image: '/essentials/bed.png',
        description: 'Comfortable orthopedic dog bed',
        inStock: true
      },
      {
        id: 5,
        name: 'Dog Grooming Kit',
        category: 'Grooming',
        price: 39.99,
        image: '/essentials/kit.png',
        description: 'Complete grooming set for dogs',
        inStock: true
      },
      {
        id: 6,
        name: 'Dog Training Treats',
        category: 'Food',
        price: 15.99,
        image: 'https://via.placeholder.com/200x200/0891B2/FFFFFF?text=Treats',
        description: 'Healthy training rewards',
        inStock: true
      }
    ],
    Cat: [
      {
        id: 7,
        name: 'Premium Cat Food',
        category: 'Food',
        price: 42.99,
        image: '/essentials/cat-food.png',
        description: 'Nutritious food for indoor cats',
        inStock: true
      },
      {
        id: 8,
        name: 'Cat Litter Box',
        category: 'Hygiene',
        price: 34.99,
        image: '/essentials/litter-box.png',
        description: 'Easy-clean litter box system',
        inStock: true
      },
      {
        id: 9,
        name: 'Cat Scratching Post',
        category: 'Furniture',
        price: 49.99,
        image: '/essentials/scratching-post.png',
        description: 'Multi-level scratching tower',
        inStock: true
      },
      {
        id: 10,
        name: 'Cat Toy Collection',
        category: 'Toys',
        price: 19.99,
        image: '/essentials/cat-toys.png',
        description: 'Feather wands and interactive toys',
        inStock: false
      },
      {
        id: 11,
        name: 'Cat Carrier',
        category: 'Travel',
        price: 54.99,
        image: '/essentials/carrier.png',
        description: 'Comfortable travel carrier',
        inStock: true
      },
      {
        id: 12,
        name: 'Cat Treats - Salmon',
        category: 'Food',
        price: 12.99,
        image: '/essentials/cat-treats.png',
        description: 'Delicious salmon flavor treats',
        inStock: true
      }
    ]
  };

  const addToCart = (item) => {
    dispatch({
      type: actionTypes.ADD_TO_CART,
      payload: { ...item, quantity: 1 }
    });
    // You can add a toast notification here
    alert(`${item.name} added to cart!`);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Food: '🍽️',
      Accessories: '🎀',
      Toys: '🎾',
      Comfort: '🛏️',
      Grooming: '✂️',
      Hygiene: '🧽',
      Furniture: '🏠',
      Travel: '✈️'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Pet Essentials</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Everything your furry friends need for a happy and healthy life. Browse our curated selection of premium pet supplies.
        </p>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            {['Dog', 'Cat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-lg font-semibold transition duration-300 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab === 'Dog' ? '🐕' : '🐱'} {tab} Essentials
              </button>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-lg p-4 mb-8 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg font-semibold mr-2">🛒 Cart:</span>
              <span className="text-gray-600">{state.cart.length} items</span>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300">
              View Cart
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {essentialItems[activeTab].map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-white rounded-full px-2 py-1 text-sm font-medium flex items-center">
                    {getCategoryIcon(item.category)} {item.category}
                  </span>
                </div>
                {!item.inStock && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-red-500 text-white rounded-full px-2 py-1 text-sm font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">${item.price}</span>
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.inStock}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                      item.inStock
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Why Choose Our Essentials?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Only the best products for your beloved pets</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick delivery to keep your pets happy</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing on all essentials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Essentials;

