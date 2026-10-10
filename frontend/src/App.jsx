import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import ProtectedRoute from './components/ui/ProtectedRoute';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppProvider } from './context/AppContext';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PetServices from './pages/PetServices';
import Essentials from './pages/Essentials';
import Grooming from './pages/Grooming';
import PetFinder from './pages/PetFinder';
import DiseasePrediction from './pages/DiseasePrediction';
import Gallery from './pages/Gallery';
import OurTeam from './pages/OurTeam';
import Consultant from './pages/Consultant';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Checkout from './pages/Checkout';
import Account from './pages/Account';

function App() {
  return (
    // Auth wraps Cart: the cart needs to know who is signed in before it
    // can decide between the server and the guest copy.
    <AuthProvider>
      <CartProvider>
        <AppProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-cream">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/pet-services" element={<PetServices />} />
                  <Route path="/essentials" element={<Essentials />} />
                  <Route path="/grooming" element={<Grooming />} />
                  <Route path="/pet-finder" element={<PetFinder />} />
                  <Route path="/disease-prediction" element={<DiseasePrediction />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/team" element={<OurTeam />} />
                  <Route path="/consult-adii-jain" element={<Consultant />} />

                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  <Route
                    path="/checkout"
                    element={<ProtectedRoute><Checkout /></ProtectedRoute>}
                  />
                  <Route
                    path="/account"
                    element={<ProtectedRoute><Account /></ProtectedRoute>}
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AppProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
