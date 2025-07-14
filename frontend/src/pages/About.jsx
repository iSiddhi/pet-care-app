import React from 'react';

const About = () => {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/about/about.png')" }}
    >
      {/* Overlay for readability */}
      {/* <div className="bg-white/80 flex-grow"> */}
      <div className="bg-black/10 min-h-screen">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              About PetCare
            </h1>

            <div className="bg-purple-100 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                At PetCare, we believe that every pet deserves the best possible care.
                Our platform combines modern technology with veterinary expertise to provide
                pet owners with the tools they need to keep their furry friends healthy and happy.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-green-100 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Technology-Driven
                </h3>
                <p className="text-gray-700">
                  We leverage artificial intelligence and machine learning to provide
                  personalized health insights and recommendations for your pets.
                </p>
              </div>
              <div className="bg-green-100 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Veterinary Partnership
                </h3>
                <p className="text-gray-700">
                  Our platform connects you with licensed veterinarians and pet care
                  professionals in your area for seamless appointment scheduling.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                What We Offer
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Comprehensive pet health record management
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Easy veterinary appointment scheduling
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  AI-powered health monitoring and alerts
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Vaccination and medication reminders
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Educational resources and pet care tips
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
