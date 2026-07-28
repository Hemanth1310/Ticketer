
import React from 'react';

const BannerSkeleton = () => {
  return (
    <div className="w-full bg-gray-300 h-50 md:h-100 lg:h-100 flex flex-col items-center rounded-xl justify-center relative overflow-hidden animate-pulse">
      {/* Skeleton Title (Matches text-2xl to text-9xl size) */}
      <div className="h-8 md:h-24 w-3/4 max-w-2xl bg-gray-400 rounded-lg" />

      {/* Skeleton Subtitle ("In cinemas now.") */}
      <div className="h-5 md:h-7 w-40 bg-gray-400/80 rounded mt-4" />

      {/* Skeleton Navigation Dots */}
      <div className="absolute bottom-4 flex gap-2">
        <div className="h-2 w-8 bg-gray-400 rounded-full" />
        <div className="h-2 w-2 bg-gray-400 rounded-full" />
        <div className="h-2 w-2 bg-gray-400 rounded-full" />
      </div>
    </div>
  );
};

export default BannerSkeleton;