import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState('All');

  // Categories for filtering
  const categories = ['All', 'Dogs', 'Cats', 'Rabbits', 'Birds', 'Fish', 'Turtles'];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const galleryData = await apiService.getGallery();
        // Add categories to mock data
        const imagesWithCategories = galleryData.map((img, index) => ({
          ...img,
          category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1] // Skip 'All'
        }));
        setImages(imagesWithCategories);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Filter images based on selected category
  const filteredImages = filter === 'All' 
    ? images 
    : images.filter(img => img.category === filter);

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setCurrentIndex(0);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setSelectedImage(filteredImages[prevIndex]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  useEffect(() => {
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, currentIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Pet Photo Gallery</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover adorable moments captured with our furry, feathered, and scaled friends. Click on any image to view it in full size.
        </p>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <div className="flex flex-wrap gap-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
                    filter === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Image Counter */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Showing {filteredImages.length} of {images.length} images
            {filter !== 'All' && ` in ${filter} category`}
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer group"
              onClick={() => openLightbox(image, index)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition duration-300 text-2xl">
                    🔍
                  </span>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {image.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{image.caption}</h3>
                <p className="text-gray-600 text-sm">Click to enlarge</p>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredImages.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📷</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No images found</h2>
            <p className="text-gray-600 mb-4">Try selecting a different category</p>
            <button
              onClick={() => setFilter('All')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Show All Images
            </button>
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ✕
              </button>

              {/* Previous Button */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                disabled={filteredImages.length <= 1}
              >
                ←
              </button>

              {/* Next Button */}
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
                disabled={filteredImages.length <= 1}
              >
                →
              </button>

              {/* Image */}
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="max-w-full max-h-full object-contain"
              />

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h3 className="text-white text-xl font-semibold mb-1">{selectedImage.caption}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">{selectedImage.category}</span>
                  <span className="text-gray-300">
                    {currentIndex + 1} of {filteredImages.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Background Click to Close */}
            <div
              className="absolute inset-0 -z-10"
              onClick={closeLightbox}
            ></div>
          </div>
        )}

        {/* Upload Section */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Share Your Pet Photos!</h2>
          <p className="text-gray-600 mb-6">
            Have adorable photos of your pets? We'd love to feature them in our gallery!
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
            📤 Upload Photos
          </button>
        </div>

        {/* Gallery Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(1).map((category) => {
            const count = images.filter(img => img.category === category).length;
            return (
              <div key={category} className="bg-white rounded-lg p-4 shadow-md text-center">
                <div className="text-2xl font-bold text-blue-600">{count}</div>
                <div className="text-gray-600 text-sm">{category}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Gallery;

