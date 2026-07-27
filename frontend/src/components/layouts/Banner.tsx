import React, { useEffect, useState } from 'react'
import type { Movies } from '../../types'
import getImageUrl from '../../utils/getImageURL'

type Props = {
    slides: Movies[]
}

const Banner = ({slides}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // 1. Automatic slideshow timer (changes slide every 5 seconds)
  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const interval = setInterval(() => {
      // Start fade out animation
      setIsFading(true);

      // Wait 300ms for fade-out, switch slide, then fade back in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        setIsFading(false);
      }, 300);
    }, 5000); // 5000ms = 5 seconds per slide

    return () => clearInterval(interval);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  const activeSlide = slides[currentIndex];

  return (
    <div
      className={`w-full bg-gray-600 h-50 md:h-100 lg:h-100 flex flex-col items-center justify-center 
        transition-all duration-1000 ease-linear relative overflow-hidden ${
        isFading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${getImageUrl(
          activeSlide.imagePath
        )})`,
        backgroundSize: 'cover',
        backgroundPosition: '60% 20%',
      }}
    >
      {/* Title with subtle slide-up animation */}
      <h1
        className={`text-2xl md:text-9xl text-white font-bold transition-all duration-500 transform ${
          isFading ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {activeSlide.title}
      </h1>

      <p className="text-xl md:text-2xl text-white/90 mt-2">In cinemas now.</p>

      {/* Navigation Dots Indicator */}
      <div className="absolute bottom-4 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsFading(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsFading(false);
              }, 300);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Banner