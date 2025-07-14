import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I'm Myaau mam, your pet care assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = () => {
    if (!newMessage.trim() || isLoading) return;

    const userText = newMessage.trim().toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedMessages = [...messages, { sender: 'user', text: newMessage, time }];
    setMessages(updatedMessages);
    setNewMessage('');
    setIsLoading(true);

    setTimeout(() => {
      let botText = '';

      if (userText.includes("dog")) {
        botText = "Dogs need regular exercise, good nutrition, and routine vet visits. Let me know if you need info about a specific breed.";
      } else if (userText.includes("cat")) {
        botText = "Cats love quiet spaces and clean litter boxes. They're independent but still need regular checkups.";
      } else if (userText.includes("golden retriever")) {
        botText = "Golden Retrievers are affectionate and energetic. They enjoy swimming and long walks!";
      } else if (userText.includes("food")) {
        botText = "Feed pets according to their age and breed. Quality food leads to a longer, healthier life.";
      } else if (userText.includes("hello") || userText.includes("hi")) {
        botText = "Hi there! I'm Myaau 🐾. Ask me anything about your pet’s care.";
      } else {
        botText = "Thanks for reaching out to Pet Care Hub! For more help, contact us at 📞 +91-9876543210 or ✉️ support@petcarehub.com";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botText, time }]);
      setIsLoading(false);
    }, 800);
  };

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
      {/* Hero Section */}
      <section className="relative text-white py-20 overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0">
          <source src="/home/HOMEE.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600 to-red-600 opacity-35 z-0"></div>
        <div className="relative z-20 container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Pet Care Hub</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your comprehensive solution for all pet care needs. From finding the perfect pet to health monitoring and grooming services.
          </p>
          <Link to="/pet-services" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
            Explore Services
          </Link>
        </div>
      </section>

      {/* Quick Access */}
      <section className="relative py-16 overflow-hidden text-gray-800">
        <div className="absolute inset-0">
          <img src="/home/hello.png" alt="Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white opacity-20"></div>
        </div>
        <div className="relative container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quickLinks.map((link, i) => (
              <Link key={i} to={link.path} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition duration-300">{link.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{link.name}</h3>
                <p className="text-gray-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🎯</span></div>
            <h3 className="text-xl font-semibold mb-2">Find Perfect Pets</h3>
            <p className="text-gray-600">AI-powered pet finder for your ideal match.</p>
          </div>
          <div>
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🔬</span></div>
            <h3 className="text-xl font-semibold mb-2">Health Monitoring</h3>
            <p className="text-gray-600">Smart disease prediction for pet wellness.</p>
          </div>
          <div>
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">⭐</span></div>
            <h3 className="text-xl font-semibold mb-2">Expert Care</h3>
            <p className="text-gray-600">Trusted grooming & pet essentials delivered.</p>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <div className={`fixed bottom-0 right-0 m-4 z-50 ${chatOpen ? 'w-80 h-96' : 'w-44 h-16'} bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300`}>
        <div className="flex items-center justify-center cursor-pointer bg-purple-600 text-white w-full p-2" onClick={() => setChatOpen(!chatOpen)}>
          <span className="flex items-center">{chatOpen ? 'Close Chat' : 'Chat with Myaau 🐱'}</span>
        </div>
        {chatOpen && (
          <div className="p-4 h-full flex flex-col">
            <div className="overflow-y-auto flex-grow mb-2 chat-scrollbar" style={{ maxHeight: 'calc(100% - 40px)' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'} mb-2`}>
                  <div className={`${msg.sender === 'bot' ? 'bg-purple-100 text-gray-900' : 'bg-purple-600 text-white'} rounded-lg p-2 max-w-xs`}>
                    <div>{msg.text}</div>
                    <div className={`text-xs ${msg.sender === 'bot' ? 'text-purple-500' : 'text-purple-200'} text-right mt-1`}>{msg.time}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-2">
                  <div className="bg-purple-100 text-gray-900 rounded-lg p-2 flex space-x-1">
                    <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-auto">
              <div className="flex">
                <input
                  className="flex-grow p-2 border border-purple-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(); }}
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  className="bg-purple-600 text-white px-4 rounded-r-md hover:bg-purple-700 focus:outline-none disabled:opacity-50"
                >
                  →
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">Ask me anything about pet care!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
