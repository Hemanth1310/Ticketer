import { useAllMovies } from "./hooks/dataQueryHook"



const useAllMoviesDataProvider = () =>{
    const {data,isLoading, isError, refetch} = useAllMovies()

    const featuredMovies = data?.filter(movie=>movie.featured)
    const moviesList  = data?.map(movie=>movie.title)
    return {
        data,
        featuredMovies,
        moviesList,
        isLoading,
        isError,
        refetch
    }
}

export default useAllMoviesDataProvider