import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

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
              <Link
                to="/"
                className="text-gray-800 hover:bg-green hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              
              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleServicesDropdown}
                  className="text-gray-800 hover:bg-green hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  Services
                  <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {isServicesDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <Link to="/pet-services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">🐾 Pet Services</Link>
                      <Link to="/essentials" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">🛒 Essentials</Link>
                      <Link to="/grooming" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">✂️ Grooming</Link>
                      <Link to="/pet-finder" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">🔍 Pet Finder</Link>
                      <Link to="/disease-prediction" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">🏥 Health Check</Link>
                    </div>
                  </div>
                )}
              </div>
              
              <Link
                to="/gallery"
                className="text-gray-800 hover:bg-green hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Gallery
              </Link>
              <Link
                to="/team"
                className="text-gray-800 hover:bg-green hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Our Team
              </Link>
              <Link
                to="/about"
                className="text-gray-800 hover:bg-green hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-800 hover:bg-green hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="bg-green inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-900 hover:bg-green focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              <Link to="/" className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
              <Link to="/pet-services" className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">🐾 Pet Services</Link>
              <Link to="/essentials" className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">🛒 Essentials</Link>
              <Link to="/grooming" className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">✂️ Grooming</Link>
              <Link to="/pet-finder" className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">🔍 Pet Finder</Link>
              <Link to="/disease-prediction" className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">🏥 Health Check</Link>
              <Link to="/gallery" className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">📸 Gallery</Link>
              <Link to="/team" className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">👥 Our Team</Link>
              <Link to="/about" className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">About</Link>
              <Link to="/contact" className="text-gray-800 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">Contact</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

