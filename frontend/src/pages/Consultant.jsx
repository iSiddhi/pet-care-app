import React from 'react';

const Consultant = () => {
  const adiiJain = {
    name: 'Adii Jain',
    image: '/gallery/Consultant.jpeg', // Image path: public/consultants/adii-jain.jpg
    title: 'Store Consultant',
    phone: '+91-9876543210',
    email: 'adiijain.petcare@gmail.com',
    education: 'B.Tech CSE, Lovely Professional University',
  };

  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 py-12 px-4">

      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Talk to Our Consultant</h1>
        <p className="text-gray-600 mb-10">
          Have questions about our services? Get in touch with our trusted consultant!
        </p>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden w-full max-w-sm mx-auto transform hover:scale-105 transition duration-300">
          <img
            src={adiiJain.image}
            alt={adiiJain.name}
            className="w-full h-72 object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800">{adiiJain.name}</h2>
            <p className="text-blue-600 font-medium">{adiiJain.title}</p>
            <p className="text-sm text-gray-500 mt-1">{adiiJain.education}</p>
            <div className="mt-4 text-left space-y-1 text-sm">
              <p><strong>📞 Phone:</strong> <a href={`tel:${adiiJain.phone}`} className="text-blue-600 hover:underline">{adiiJain.phone}</a></p>
              <p><strong>📧 Email:</strong> <a href={`mailto:${adiiJain.email}`} className="text-blue-600 hover:underline">{adiiJain.email}</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultant;
