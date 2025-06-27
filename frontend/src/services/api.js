import axios from 'axios';

// Base API URL - adjust this based on your backend
const BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const apiService = {
  // Pet services
  getPetsByType: async (type) => {
    try {
      const response = await api.get(`/pets?type=${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pets:', error);
      throw error;
    }
  },

  // Get breeds by pet type
  getBreedsByPet: async (pet) => {
    try {
      const response = await api.get(`/breeds?pet=${pet}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching breeds:', error);
      throw error;
    }
  },

  // Disease prediction
  predictDisease: async (data) => {
    try {
      const response = await api.post('/predict-disease', data);
      return response.data;
    } catch (error) {
      console.error('Error predicting disease:', error);
      throw error;
    }
  },

  // Get groomers
  getGroomers: async () => {
    try {
      const response = await api.get('/groomers');
      return response.data;
    } catch (error) {
      console.error('Error fetching groomers:', error);
      // Return mock data for now
      return [
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah@petcare.com',
          phone: '+1-555-0123',
          avatar: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=SJ',
          specialties: ['Dogs', 'Cats']
        },
        {
          id: 2,
          name: 'Mike Chen',
          email: 'mike@petcare.com',
          phone: '+1-555-0124',
          avatar: 'https://via.placeholder.com/150/059669/FFFFFF?text=MC',
          specialties: ['Dogs', 'Birds']
        },
        {
          id: 3,
          name: 'Lisa Rodriguez',
          email: 'lisa@petcare.com',
          phone: '+1-555-0125',
          avatar: 'https://via.placeholder.com/150/DC2626/FFFFFF?text=LR',
          specialties: ['Cats', 'Rabbits']
        }
      ];
    }
  },

  // Get team members
  getTeam: async () => {
    try {
      const response = await api.get('/team');
      return response.data;
    } catch (error) {
      console.error('Error fetching team:', error);
      // Return mock data for now
      return [
        {
          id: 1,
          name: 'John Smith',
          role: 'CEO',
          email: 'john@petcare.com',
          avatar: 'https://via.placeholder.com/200/4F46E5/FFFFFF?text=CEO',
          bio: 'Passionate about pet care with 15+ years of experience in veterinary services.'
        },
        {
          id: 2,
          name: 'Emily Davis',
          role: 'Co-CEO',
          email: 'emily@petcare.com',
          avatar: 'https://via.placeholder.com/200/059669/FFFFFF?text=Co-CEO',
          bio: 'Expert in pet nutrition and behavior with a mission to improve pet lives.'
        }
      ];
    }
  },

  // Get gallery images
  getGallery: async () => {
    try {
      const response = await api.get('/gallery');
      return response.data;
    } catch (error) {
      console.error('Error fetching gallery:', error);
      // Return mock data for now
      return [
        { id: 1, url: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Pet+1', caption: 'Happy Dog' },
        { id: 2, url: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=Pet+2', caption: 'Cute Cat' },
        { id: 3, url: 'https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Pet+3', caption: 'Adorable Rabbit' },
        { id: 4, url: 'https://via.placeholder.com/300x200/7C3AED/FFFFFF?text=Pet+4', caption: 'Beautiful Bird' },
        { id: 5, url: 'https://via.placeholder.com/300x200/EA580C/FFFFFF?text=Pet+5', caption: 'Colorful Fish' },
        { id: 6, url: 'https://via.placeholder.com/300x200/0891B2/FFFFFF?text=Pet+6', caption: 'Gentle Turtle' }
      ];
    }
  }
};

export default api;

