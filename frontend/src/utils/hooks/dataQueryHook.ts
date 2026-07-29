import { useQuery } from "@tanstack/react-query"
import axios from "../authMiddleware"
import type { MovieDetailsState, Movies } from '../../types'


const BASE_API_URL  = import.meta.env.VITE_API_URL

const fetchAllMovies = async():Promise<Movies[]> =>{
    const {data} =await axios.get(`${BASE_API_URL}/api/public/all-movies`)
    return data.payload.movies
}

export const useAllMovies = () =>{
    return useQuery({
        queryKey:['allMovies'],
        queryFn: fetchAllMovies
    })
}

const fetchMovieDetails = async(id:string):Promise<MovieDetailsState>=>{
    const {data} = await axios.get(`${BASE_API_URL}/api/public/movieDetails/${id}`)
    console.log(data.payload)
    return data.payload
}

export const useMovieDetails = (id: string | undefined) => {
  return useQuery({
    // 1. Namespace the query key to avoid cache collisions
    queryKey: ['movieDetails', id],
    
    // 2. Wrap queryFn safely
    queryFn: () => {
      if (!id) throw new Error("Movie ID is required");
      return fetchMovieDetails(id);
    },

    // 3. Prevent fetching if 'id' is missing or empty
    enabled: Boolean(id),

    // Optional: Keep data fresh for 5 minutes before refetching automatically
    staleTime: 1000 * 60 * 5, 
  });
};
