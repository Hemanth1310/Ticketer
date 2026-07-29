import React from 'react'


const MovieDetailsSkeleton = () => {
  return (
    <div className='w-full h-full'>
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

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10">
        
        <div className="flex flex-col animate-pulse">
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
    </div>
    </div>
  )
}

export default MovieDetailsSkeleton