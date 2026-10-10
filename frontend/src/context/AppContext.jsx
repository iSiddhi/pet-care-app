import { createContext, useContext, useReducer } from 'react';

// Cart lives in CartContext now (it needs auth + server sync).
// This holds the lighter shared UI state only.
const initialState = {
  selectedPet: '',
  selectedBreed: '',
  priceRange: [0, 1000],
  pets: [],
  breeds: [],
  groomers: [],
  team: [],
  gallery: [],
};

export const actionTypes = {
  SET_PETS: 'SET_PETS',
  SET_BREEDS: 'SET_BREEDS',
  SET_SELECTED_PET: 'SET_SELECTED_PET',
  SET_SELECTED_BREED: 'SET_SELECTED_BREED',
  SET_PRICE_RANGE: 'SET_PRICE_RANGE',
  SET_GROOMERS: 'SET_GROOMERS',
  SET_TEAM: 'SET_TEAM',
  SET_GALLERY: 'SET_GALLERY',
};

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

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
