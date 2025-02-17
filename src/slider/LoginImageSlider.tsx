import React, { useState, useEffect } from 'react';
// Import images from the assets folder
import image1 from '../assets/Image/auth/img1.svg';  
import image2 from '../assets/Image/auth/img2.png';  
import image3 from '../assets/Image/auth/img3.png';  

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [image1, image2, image3];

  // Automatically slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-[80%] p-5 mx-auto overflow-hidden">
      {/* Image Container */}
      <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
