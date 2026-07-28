import React from 'react';
import BannerSkeleton from './BannerSkeleton';

const MovieSkeleton = () => {
  // Create an array of 8 placeholder cards for the grid
  const skeletonCards = Array.from({ length: 8 });

  return (
    <div className='w-full h-full'>
        <BannerSkeleton/>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10">
        
      {skeletonCards.map((_, index) => (
        <div key={index} className="flex flex-col animate-pulse">
          {/* Poster Image Placeholder */}
          <div className="h-80 w-60 bg-gray-200 dark:bg-gray-300 rounded-xl" />

          {/* Title Placeholder */}
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-300 rounded mt-3" />

          {/* Genre Placeholder */}
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-300 rounded mt-2" />

          {/* Description Lines Placeholder */}
          <div className="mt-2 space-y-1.5 w-60">
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-300 rounded" />
            <div className="h-3 w-4/5 bg-gray-200 dark:bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
        </div>
  );
};

export default MovieSkeleton;