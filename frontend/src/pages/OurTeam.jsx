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
      <div className="min-h-screen bg-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-pink-100 bg-cover bg-center py-8"
      style={{
        backgroundImage: "url('/home/homee.png')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="bg-pink bg-opacity-10 backdrop-blur-sm container mx-auto px-4 rounded-lg py-10 shadow-lg">
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

        {/* You can re-add Company Values, Stats, Mission, Join Section, Contact here */}
      </div>
    </div>
  );
};

export default OurTeam;
