import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const quickLinks = [
    { name: 'Pet Services', path: '/pet-services', icon: '🐾', description: 'Find pets by category' },
    { name: 'Essentials', path: '/essentials', icon: '🛒', description: 'Pet food & supplies' },
    { name: 'Grooming', path: '/grooming', icon: '✂️', description: 'Professional grooming' },
    { name: 'Pet Finder', path: '/pet-finder', icon: '🔍', description: 'Find your perfect pet' },
    { name: 'Health Check', path: '/disease-prediction', icon: '🏥', description: 'AI health diagnosis' },
    { name: 'Gallery', path: '/gallery', icon: '📸', description: 'Pet photo gallery' }
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Pet Care Hub</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your comprehensive solution for all pet care needs. From finding the perfect pet to health monitoring and grooming services.
          </p>
          <Link 
            to="/pet-services" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Explore Services
          </Link>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300">
                  {link.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{link.name}</h3>
                <p className="text-gray-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Perfect Pets</h3>
              <p className="text-gray-600">Use our AI-powered pet finder to match with your ideal companion based on preferences and lifestyle.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Health Monitoring</h3>
              <p className="text-gray-600">Advanced AI disease prediction system to keep your pets healthy and happy.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Care</h3>
              <p className="text-gray-600">Professional grooming services and pet care essentials from trusted experts.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

