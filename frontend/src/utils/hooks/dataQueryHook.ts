import { useQuery } from "@tanstack/react-query"
import axios from "../authMiddleware"
import type { Movies } from '../../types'


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