import axios from 'axios';

// Set VITE_API_URL in frontend/.env  (falls back to the local backend)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ---- Auth token handling ----
const TOKEN_KEY = 'petcare_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Session expired -> drop the token so the UI can show the login state
    if (error.response?.status === 401) tokenStore.clear();
    return Promise.reject(error);
  }
);

// ---- Auth ----
export const authService = {
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    if (data.token) tokenStore.set(data.token);
    return data.data;
  },
  login: async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    if (data.token) tokenStore.set(data.token);
    return data.data;
  },
  me: async () => {
    const { data } = await api.get('/auth/me');
    return data.data;
  },
  logout: () => tokenStore.clear(),
  isLoggedIn: () => Boolean(tokenStore.get()),
};

// ---- Cart (all protected) ----
export const cartService = {
  get: async () => (await api.get('/cart')).data.cart,
  add: async (productId, quantity = 1) =>
    (await api.post('/cart', { productId, quantity })).data.cart,
  update: async (productId, quantity) =>
    (await api.put(`/cart/${productId}`, { quantity })).data.cart,
  remove: async (productId) => (await api.delete(`/cart/${productId}`)).data.cart,
  clear: async () => (await api.delete('/cart')).data.cart,
  // Folds a guest cart into the user's server cart right after login
  merge: async (items) => (await api.post('/cart/merge', { items })).data.cart,
};

// ---- Orders ----
export const orderService = {
  // Returns { order, payment } -- payment carries the UPI QR and URI
  create: async (payload) => (await api.post('/orders', payload)).data,
  myOrders: async () => (await api.get('/orders/my')).data.orders,
  byId: async (id) => (await api.get(`/orders/${id}`)).data.order,

  // Polled by the payment screen while the customer pays
  payment: async (id) => (await api.get(`/orders/${id}/payment`)).data,
  submitUtr: async (id, utr) =>
    (await api.post(`/orders/${id}/payment/utr`, { utr })).data.payment,

  // Admin
  pendingPayments: async () => (await api.get('/orders/pending-payments')).data.orders,
  verifyPayment: async (id, approve, reason) =>
    (await api.patch(`/orders/${id}/payment/verify`, { approve, reason })).data.order,
};

// ---- Grooming bookings ----
export const bookingService = {
  slots: async (groomer, date) =>
    (await api.get('/bookings/slots', { params: { groomer, date } })).data.slots,
  create: async (payload) => (await api.post('/bookings', payload)).data.booking,
  mine: async () => (await api.get('/bookings/my')).data.bookings,
  cancel: async (id) => (await api.patch(`/bookings/${id}/cancel`)).data.booking,
};

// ---- Catalogue + content ----
// Kept on the original apiService export so existing pages keep working.
export const apiService = {
  getPetsByType: async (type) => {
    const { data } = await api.get('/pets', { params: { type } });
    return data;
  },

  getBreedsByPet: async (pet) => {
    const { data } = await api.get('/breeds', { params: { pet } });
    return data;
  },

  getEssentials: async (petType) => {
    const { data } = await api.get('/essentials', { params: { petType } });
    return data.products;
  },

  getEssentialsGrouped: async () => {
    const { data } = await api.get('/essentials', { params: { grouped: true } });
    return data.products;
  },

  predictDisease: async (payload) => {
    const { data } = await api.post('/predict-disease', payload);
    return data.prediction;
  },

  getGroomers: async () => (await api.get('/groomers')).data,

  getTeam: async () => (await api.get('/team')).data,

  getGallery: async (category) =>
    (await api.get('/gallery', { params: category ? { category } : {} })).data,

  submitContact: async (payload) => {
    const { data } = await api.post('/contact', payload);
    return data;
  },

  chatWithBot: async (message, history = []) => {
    const { data } = await api.post('/chatbot', { message, history });
    return data.reply;
  },

  health: async () => (await api.get('/health')).data,
};

export default api;
