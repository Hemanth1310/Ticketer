import React, { useState } from 'react'
import useAllMoviesDataProvider from '../utils/allMoviesDataProvider'
import Banner from '../components/layouts/Banner'
import getImageUrl from '../utils/getImageURL'
import { useNavigate } from 'react-router'
import MovieSkeleton from '../components/layouts/MovieSkeleton'

type Props = {}

const Home = (props: Props) => {
  const {
        data,
        featuredMovies,
        moviesList,
        isLoading,
        isError,
        refetch
    } = useAllMoviesDataProvider()
    const navigate = useNavigate()
    const handleMovieDetails=(movieID:string)=>{
      navigate(`/movie/${movieID}`)
    }

    if(isLoading){
      return <MovieSkeleton/>
    }
    if(1===1){
      return <div className='w-full h-full flex items-center justify-center'>
        Something Went Wrong. Please try to <span className='text-brand-primary' onClick={()=>refetch()}>Refetch.</span>
      </div>
    }
  return (
    <div className='w-full h-full '>
      <Banner slides={featuredMovies?featuredMovies:[]}/>
       <div className="flex flex-wrap flex-col items-center justify-between mt-10">
        <h2 className="text-2xl md:text-4xl">Currently screening in cinemas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-10">
        {data?.map((movie)=>
        <div key={movie.id} className="group flex flex-col cursor-pointer" onClick={()=>handleMovieDetails(movie.id)}>
          <div className="h-80 w-60 overflow-hidden flex items-center justify-center">
             <img className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" src={getImageUrl(movie.imagePath)}/>
          </div>
         
          <h3 className="text-lg font-bold mt-3 group-hover:text-brand-primary transition-colors">
                {movie.title}
              </h3>
              <p className="text-sm font-medium text-gray-500">{movie.genre}</p>
              <p className="text-sm w-60 text-gray-400 mt-1">
                {movie.description && movie.description.length >= 100 
                  ? movie.description.slice(0, 100) + "..." 
                  : movie.description}
              </p>
        </div>)}
        </div>

      </div>
    </div>
  )
}

export default Home