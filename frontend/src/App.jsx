import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
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
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-offwhite">
          <Navbar />
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
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App
