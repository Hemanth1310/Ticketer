import React from 'react'
import useAllMoviesDataProvider from '../utils/allMoviesDataProvider'
import Banner from '../components/layouts/Banner'

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

  return (
    <div className='w-full h-full '>
      <Banner slides={featuredMovies?featuredMovies:[]}/>
    </div>
  )
}

export default Home