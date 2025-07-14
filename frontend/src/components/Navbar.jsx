import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  const location = useLocation();

  // Close dropdowns on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesDropdownOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleServicesDropdown = () => {
    setIsServicesDropdownOpen(!isServicesDropdownOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-lavender shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
              🐾 Pet Care Hub
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-gray-800 hover:bg-purple-100 hover:text-purple-700 active:bg-purple-200 focus:ring-2 focus:ring-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                Home
              </Link>

              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleServicesDropdown}
                  className="text-gray-800 hover:bg-purple-100 hover:text-purple-700 active:bg-purple-200 focus:ring-2 focus:ring-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  Services
                  <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {isServicesDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <Link to="/pet-services" onClick={() => setIsServicesDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">🐾 Pet Services</Link>
                      <Link to="/essentials" onClick={() => setIsServicesDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">🛒 Essentials</Link>
                      <Link to="/grooming" onClick={() => setIsServicesDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">✂️ Grooming</Link>
                      <Link to="/pet-finder" onClick={() => setIsServicesDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">🔍 Pet Finder</Link>
                      <Link to="/disease-prediction" onClick={() => setIsServicesDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">🏥 Health Check</Link>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/gallery" className="text-gray-800 hover:bg-purple-100 hover:text-purple-700 active:bg-purple-200 focus:ring-2 focus:ring-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                Gallery
              </Link>
              <Link to="/team" className="text-gray-800 hover:bg-purple-100 hover:text-purple-700 active:bg-purple-200 focus:ring-2 focus:ring-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                Our Team
              </Link>
              <Link to="/about" className="text-gray-800 hover:bg-purple-100 hover:text-purple-700 active:bg-purple-200 focus:ring-2 focus:ring-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                About
              </Link>
              <Link to="/contact" className="text-gray-800 hover:bg-purple-100 hover:text-purple-700 active:bg-purple-200 focus:ring-2 focus:ring-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                Contact
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-gray-800 hover:bg-purple-100 hover:text-purple-700 active:bg-purple-200 focus:ring-2 focus:ring-purple-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">Home</Link>
              <Link to="/pet-services" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">🐾 Pet Services</Link>
              <Link to="/essentials" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">🛒 Essentials</Link>
              <Link to="/grooming" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">✂️ Grooming</Link>
              <Link to="/pet-finder" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">🔍 Pet Finder</Link>
              <Link to="/disease-prediction" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">🏥 Health Check</Link>
              <Link to="/gallery" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">📸 Gallery</Link>
              <Link to="/team" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">👥 Our Team</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">About</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100">Contact</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
