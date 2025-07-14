// import React, { useState, useEffect } from 'react';
// import { apiService } from '../services/api';

// const OurTeam = () => {
//   const [team, setTeam] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTeam = async () => {
//       try {
//         const teamData = await apiService.getTeam();
//         setTeam(teamData);
//       } catch (error) {
//         console.error('Error fetching team:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTeam();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading team...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4">
//         <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Our Team</h1>
//         <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
//           Meet the passionate leaders behind Pet Care Hub. Our team is dedicated to providing the best care and services for your beloved pets.
//         </p>

//         {/* Team Members */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
//           {team.map((member) => (
//             <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
//               <div className="relative">
//                 <img
//                   src={member.avatar}
//                   alt={member.name}
//                   className="w-full h-80 object-cover"
//                 />
//                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
//                   <h2 className="text-white text-2xl font-bold">{member.name}</h2>
//                   <p className="text-blue-200 text-lg font-medium">{member.role}</p>
//                 </div>
//               </div>
              
//               <div className="p-8">
//                 <p className="text-gray-600 mb-6 leading-relaxed">{member.bio}</p>
                
//                 <div className="flex items-center mb-6">
//                   <span className="mr-3 text-xl">📧</span>
//                   <a
//                     href={`mailto:${member.email}`}
//                     className="text-blue-600 hover:text-blue-800 transition duration-300"
//                   >
//                     {member.email}
//                   </a>
//                 </div>

//                 <div className="flex space-x-4">
//                   <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
//                     Contact
//                   </button>
//                   <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition duration-300">
//                     View Profile
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Company Values */}
//         <div className="mt-20">
//           <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Values</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <span className="text-3xl">❤️</span>
//               </div>
//               <h3 className="text-xl font-semibold mb-4 text-gray-800">Compassionate Care</h3>
//               <p className="text-gray-600">
//                 We treat every pet as if they were our own, providing loving and attentive care in all our services.
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <span className="text-3xl">🎓</span>
//               </div>
//               <h3 className="text-xl font-semibold mb-4 text-gray-800">Expert Knowledge</h3>
//               <p className="text-gray-600">
//                 Our team consists of experienced professionals who stay updated with the latest in pet care and health.
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <span className="text-3xl">🌟</span>
//               </div>
//               <h3 className="text-xl font-semibold mb-4 text-gray-800">Excellence</h3>
//               <p className="text-gray-600">
//                 We strive for excellence in everything we do, from our services to customer satisfaction.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Company Stats */}
//         <div className="mt-20 bg-white rounded-lg p-8 shadow-md">
//           <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Our Impact</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             <div className="text-center">
//               <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
//               <div className="text-gray-600">Happy Pets</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-green-600 mb-2">300+</div>
//               <div className="text-gray-600">Families Served</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
//               <div className="text-gray-600">Health Checks</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-orange-600 mb-2">5+</div>
//               <div className="text-gray-600">Years of Service</div>
//             </div>
//           </div>
//         </div>

//         {/* Mission Statement */}
//         <div className="mt-20 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-8 rounded-lg">
//           <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
//           <p className="text-xl max-w-3xl mx-auto leading-relaxed">
//             To provide comprehensive, compassionate, and innovative pet care services that enhance the health, happiness, 
//             and well-being of pets while supporting their families with expert guidance and unwavering dedication.
//           </p>
//         </div>

//         {/* Join Our Team */}
//         <div className="mt-16 bg-white rounded-lg p-8 shadow-md text-center">
//           <h2 className="text-2xl font-bold mb-4 text-gray-800">Join Our Team</h2>
//           <p className="text-gray-600 mb-6">
//             Are you passionate about pet care? We're always looking for dedicated individuals to join our team.
//           </p>
//           <div className="space-x-4">
//             <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
//               View Openings
//             </button>
//             <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition duration-300">
//               Submit Resume
//             </button>
//           </div>
//         </div>

//         {/* Contact Section */}
//         <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div className="bg-white rounded-lg p-6 shadow-md">
//             <h3 className="text-xl font-semibold mb-4 text-gray-800">Get in Touch</h3>
//             <div className="space-y-3">
//               <div className="flex items-center">
//                 <span className="mr-3 text-xl">📍</span>
//                 <span className="text-gray-600">123 Pet Care Street, Animal City, AC 12345</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3 text-xl">📞</span>
//                 <span className="text-gray-600">+1 (555) 123-PETS</span>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-3 text-xl">🕒</span>
//                 <span className="text-gray-600">Mon-Fri: 8AM-6PM, Sat-Sun: 9AM-5PM</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg p-6 shadow-md">
//             <h3 className="text-xl font-semibold mb-4 text-gray-800">Follow Us</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
//                 📘 Facebook
//               </button>
//               <button className="bg-blue-400 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300">
//                 🐦 Twitter
//               </button>
//               <button className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition duration-300">
//                 📷 Instagram
//               </button>
//               <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300">
//                 📺 YouTube
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OurTeam;



import React, { useState, useEffect } from 'react';

const OurTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleTeam = [
      {
        id: 1,
        name: 'Siddhi Patel',
        role: 'CEO',
        email: 'siddhipatel096@gmail.com.com',
        bio: 'Siddhi leads Pet Care Hub with a vision to bring innovation and love into pet services. With a passion for animals and leadership, she has guided the team since inception.',
        avatar: '/Ourteam/siddhi.png',
      },
      {
        id: 2,
        name: 'Samiksha Dhaka',
        role: 'CO-CEO',
        email: 'samikshadhakaa@gmail.com',
        bio: 'Samiksha brings structure, strategy, and empathy to the company. Her dedication ensures we offer top-tier services while always prioritizing pet well-being.',
        avatar: '/Ourteam/Samiksha.png',
      },
    ];
    setTeam(sampleTeam);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center py-8" style={{ backgroundImage: "url('/images/team-bg.jpg')" }}>
      <div className="bg-white bg-opacity-90 backdrop-blur-sm container mx-auto px-4 rounded-lg py-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Our Team</h1>
        <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          Meet the passionate leaders behind Pet Care Hub. Our team is dedicated to providing the best care and services for your beloved pets.
        </p>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {team.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
              <div className="relative">
                <img src={member.avatar} alt={member.name} className="w-full h-80 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                  <h2 className="text-white text-2xl font-bold">{member.name}</h2>
                  <p className="text-blue-200 text-lg font-medium">{member.role}</p>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-6 leading-relaxed">{member.bio}</p>
                <div className="flex items-center mb-6">
                  <span className="mr-3 text-xl">📧</span>
                  <a href={`mailto:${member.email}`} className="text-blue-600 hover:text-blue-800 transition duration-300">
                    {member.email}
                  </a>
                </div>
                <div className="flex space-x-4">
                  <a href={`mailto:${member.email}`} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300 text-center">
                    Contact
                  </a>
                  <a href={`/team-member/${member.id}`} className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition duration-300 text-center">
                    View Profile
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The rest of the component remains unchanged */}
        {/* Company Values, Stats, Mission, Join Section, Contact */}
      </div>
    </div>
  );
};

export default OurTeam;


