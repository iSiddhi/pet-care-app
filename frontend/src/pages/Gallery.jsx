// Updated Gallery.jsx with working image display and dynamic layout
import React, { useState, useEffect } from 'react';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Dogs', 'Cats', 'Rabbits', 'Birds', 'Fish', 'Turtles'];

  useEffect(() => {

const sampleImages = [
  { id: 1, url: '/gallery/happydog.png', caption: 'Happy Dog', category: 'Dogs' },
  { id: 2, url: '/gallery/cutedog.png', caption: 'Cute Dog', category: 'Dogs' },
  { id: 3, url: '/gallery/innocent-dog.png', caption: 'Innocent Dog', category: 'Dogs' },
  { id: 4, url: '/gallery/good-dog.png', caption: 'Good Dog', category: 'Dogs' },
  { id: 5, url: '/gallery/cutie-dog.png', caption: 'Cutie Dog', category: 'Dogs' },
  { id: 6, url: '/gallery/bad-dog.png', caption: 'Bad Dog', category: 'Dogs' },

  { id: 7, url: '/gallery/sleepingcat.png', caption: 'Sleeping Cat', category: 'Cats' },
  { id: 8, url: '/gallery/cat1.jpg', caption: 'Cat 1', category: 'Cats' },
  { id: 9, url: '/gallery/cat2.jpg', caption: 'Cat 2', category: 'Cats' },
  { id: 10, url: '/gallery/cat3.jpg', caption: 'Cat 3', category: 'Cats' },
  { id: 11, url: '/gallery/cat4.jpg', caption: 'Cat 4', category: 'Cats' },
  { id: 12, url: '/gallery/cat5.jpg', caption: 'Cat 5', category: 'Cats' },
  { id: 13, url: '/gallery/cat6.jpg', caption: 'Cat 6', category: 'Cats' },
  { id: 14, url: '/gallery/cat7.jpg', caption: 'Cat 7', category: 'Cats' },

  { id: 15, url: '/gallery/rabbit.png', caption: 'White Bunny', category: 'Rabbits' },
  { id: 16, url: '/gallery/1rabbit.jpg', caption: 'Rabbit 1', category: 'Rabbits' },
  { id: 17, url: '/gallery/2rabbit.jpg', caption: 'Rabbit 2', category: 'Rabbits' },
  { id: 18, url: '/gallery/3.rabbit.jpg', caption: 'Rabbit 3', category: 'Rabbits' },
  { id: 19, url: '/gallery/4rabbit.jpg', caption: 'Rabbit 4', category: 'Rabbits' },
  { id: 20, url: '/gallery/5rabbit.jpg', caption: 'Rabbit 5', category: 'Rabbits' },
  // { id: 21, url: '/gallery/6rabbit.jpg', caption: 'Rabbit 6', category: 'Rabbits' },
  // { id: 22, url: '/gallery/7rabbit.jpg', caption: 'Rabbit 7', category: 'Rabbits' },

  { id: 23, url: '/gallery/birdy.png', caption: 'Colorful Bird', category: 'Birds' },
  { id: 24, url: '/gallery/1.bird.jpg', caption: 'Bird 1', category: 'Birds' },
  { id: 25, url: '/gallery/2bird.jpg', caption: 'Bird 2', category: 'Birds' },
  { id: 26, url: '/gallery/3bird.jpg', caption: 'Bird 3', category: 'Birds' },
  { id: 27, url: '/gallery/4.bird.jpg', caption: 'Bird 4', category: 'Birds' },
  { id: 28, url: '/gallery/5bird.jpg', caption: 'Bird 5', category: 'Birds' },
  // { id: 29, url: '/gallery/6bird.jpg', caption: 'Bird 6', category: 'Birds' },
  // { id: 30, url: '/gallery/7bird.jpg', caption: 'Bird 7', category: 'Birds' },

  { id: 31, url: '/gallery/fishbowl.png', caption: 'Goldfish', category: 'Fish' },
  { id: 32, url: '/gallery/fish1.jpg', caption: 'Fish 1', category: 'Fish' },
  { id: 33, url: '/gallery/fish2.jpg', caption: 'Fish 2', category: 'Fish' },
  { id: 34, url: '/gallery/fish3.jpg', caption: 'Fish 3', category: 'Fish' },
  { id: 35, url: '/gallery/fish4.jpg', caption: 'Fish 4', category: 'Fish' },
  { id: 36, url: '/gallery/fish5.jpg', caption: 'Fish 5', category: 'Fish' },
  { id: 37, url: '/gallery/fish6.jpg', caption: 'Fish 6', category: 'Fish' },
  { id: 38, url: '/gallery/fish7.jpg', caption: 'Fish 7', category: 'Fish' },

  { id: 39, url: '/gallery/turtle.png', caption: 'Tiny Turtle', category: 'Turtles' },
  { id: 40, url: '/gallery/turtle1.jpg', caption: 'Turtle 1', category: 'Turtles' },
  { id: 41, url: '/gallery/turtle2.jpg', caption: 'Turtle 2', category: 'Turtles' },
  { id: 42, url: '/gallery/turtle3.jpg', caption: 'Turtle 3', category: 'Turtles' },
  { id: 43, url: '/gallery/turtle4.jpg', caption: 'Turtle 4', category: 'Turtles' },
  { id: 44, url: '/gallery/turtle5.jpg', caption: 'Turtle 5', category: 'Turtles' },
  { id: 45, url: '/gallery/turtle6.jpg', caption: 'Turtle 6', category: 'Turtles' },
  { id: 46, url: '/gallery/turtle7.jpg', caption: 'Turtle 7', category: 'Turtles' }
];


    setImages(sampleImages);
    setLoading(false);
  }, []);

  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

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
      document.body.style.overflow = 'hidden';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
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

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="rounded-lg overflow-hidden cursor-pointer relative group border bg-white"
              onClick={() => openLightbox(image, index)}
            >
              <img
                src={image.url}
                alt={image.caption}
                className="w-full h-full max-h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/gallery/placeholder.png';
                }}
              />
              <div className="absolute top-2 left-2">
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {image.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
              >✕</button>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
              >←</button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
              >→</button>
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h3 className="text-white text-xl font-semibold mb-1">{selectedImage.caption}</h3>
                <div className="flex items-center justify-between text-gray-300">
                  <span>{selectedImage.category}</span>
                  <span>{currentIndex + 1} of {filteredImages.length}</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 -z-10" onClick={closeLightbox}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
