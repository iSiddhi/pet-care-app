import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  cart: [],
  selectedPet: '',
  selectedBreed: '',
  priceRange: [0, 1000],
  pets: [],
  breeds: [],
  groomers: [],
  team: [],
  gallery: []
};

// Action types
export const actionTypes = {
  SET_PETS: 'SET_PETS',
  SET_BREEDS: 'SET_BREEDS',
  SET_SELECTED_PET: 'SET_SELECTED_PET',
  SET_SELECTED_BREED: 'SET_SELECTED_BREED',
  SET_PRICE_RANGE: 'SET_PRICE_RANGE',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  SET_GROOMERS: 'SET_GROOMERS',
  SET_TEAM: 'SET_TEAM',
  SET_GALLERY: 'SET_GALLERY'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_PETS:
      return { ...state, pets: action.payload };
    case actionTypes.SET_BREEDS:
      return { ...state, breeds: action.payload };
    case actionTypes.SET_SELECTED_PET:
      return { ...state, selectedPet: action.payload };
    case actionTypes.SET_SELECTED_BREED:
      return { ...state, selectedBreed: action.payload };
    case actionTypes.SET_PRICE_RANGE:
      return { ...state, priceRange: action.payload };
    case actionTypes.ADD_TO_CART:
      return { ...state, cart: [...state.cart, action.payload] };
    case actionTypes.REMOVE_FROM_CART:
      return { 
        ...state, 
        cart: state.cart.filter(item => item.id !== action.payload.id) 
      };
    case actionTypes.SET_GROOMERS:
      return { ...state, groomers: action.payload };
    case actionTypes.SET_TEAM:
      return { ...state, team: action.payload };
    case actionTypes.SET_GALLERY:
      return { ...state, gallery: action.payload };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

