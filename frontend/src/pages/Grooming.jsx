import React from 'react';
import { useNavigate } from 'react-router-dom';

const Grooming = () => {
  const navigate = useNavigate();

  const groomers = [
    {
      id: 1,
      name: 'Nikhil Sharma',
      avatar: '/groomers/Nikhil.png',
      email: 'nikhil@gmail.com',
      phone: '+91-9876543210',
      specialties: ['Dog Grooming', 'Spa Treatments', 'Puppy Care'],
    },
    {
      id: 2,
      name: 'Kunal Sharma',
      avatar: '/groomers/Kunal.png',
      email: 'kunal@gmail.com',
      phone: '+91-9876501234',
      specialties: ['Nail Trimming', 'Cat Grooming', 'Ear Cleaning'],
    },
    {
      id: 3,
      name: 'Nikky Singh',
      avatar: '/groomers/Nikky.png',
      email: 'Nikky@gmail.com',
      phone: '+91-9876567890',
      specialties: ['Full Grooming', 'Dental Care', 'Flea Treatment'],
    },
  ];

  const services = [
    { name: 'Basic Grooming', price: '$35-50', duration: '1-2 hours', icon: '✂️' },
    { name: 'Premium Spa', price: '$60-80', duration: '2-3 hours', icon: '🛁' },
    { name: 'Nail Trimming', price: '$15-25', duration: '30 mins', icon: '💅' },
    { name: 'Dental Care', price: '$25-40', duration: '45 mins', icon: '🦷' },
    { name: 'Flea Treatment', price: '$30-45', duration: '1 hour', icon: '🧼' },
    { name: 'Full Package', price: '$80-120', duration: '3-4 hours', icon: '⭐' },
  ];

  return (
    // <div className="min-h-screen bg-gray-50 py-8">
    <div
  className="min-h-screen bg-cover bg-center py-8 backdrop-blur-sm bg-white/60"
  style={{ backgroundImage: "url('/home/qyi.png')" }}
>

      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Professional Pet Grooming</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our experienced groomers provide top-quality care for your pets. From basic grooming to premium spa treatments, we ensure your furry friends look and feel their best.
        </p>

        {/* Services */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
                <div className="text-center">
                  <div className="text-3xl mb-3">{service.icon}</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{service.name}</h3>
                  <p className="text-blue-600 font-semibold text-xl mb-1">{service.price}</p>
                  <p className="text-gray-600 text-sm">{service.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Groomers */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Meet Our Groomers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groomers.map((groomer) => (
              <div key={groomer.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                <div className="p-6 text-center">
                  <img
                    src={groomer.avatar}
                    alt={groomer.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{groomer.name}</h3>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Specializes in:</p>
                    <div className="flex justify-center flex-wrap gap-2">
                      {groomer.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-center text-gray-600">
                      <span className="mr-2">📧</span>
                      <a href={`mailto:${groomer.email}`} className="hover:text-blue-600">
                        {groomer.email}
                      </a>
                    </div>
                    <div className="flex items-center justify-center text-gray-600">
                      <span className="mr-2">📞</span>
                      <a href={`tel:${groomer.phone}`} className="hover:text-blue-600">
                        {groomer.phone}
                      </a>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = `/book-appointment/${groomer.id}`; }} className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-center">
                      Book Appointment
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = `/groomer-profile/${groomer.id}`; }} className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300 text-center">
                      View Profile
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Book Now CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Book?</h2>
          <p className="text-xl mb-6">Give your pet the care they deserve</p>
          <button
            onClick={() => navigate('/consult-adii-jain')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Grooming;
