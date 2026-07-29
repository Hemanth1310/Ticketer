import { useParams } from 'react-router'
import { useMovieDetails } from '../utils/hooks/dataQueryHook'
import MovieDetailsSkeleton from '../components/layouts/MovieDetailsSkeleton'
import getImageUrl from '../utils/getImageURL'

const MovieDetails = () => {
    const {id} = useParams()
    const {data, isError, isLoading,refetch} = useMovieDetails(id)

    if(isLoading){
      return <MovieDetailsSkeleton/>
    }
    if(isError){
     return <div className="w-full h-screen flex flex-col gap-5 font-mono italic text-gray-500 items-center justify-center text-3xl">
        "Failed to load the page"
        <span className='text-brand-primary' onMouseDown={() => refetch()}>Refetch</span>
      </div>
    }

    const ImageUrl = data?data.imagePath:""


  return (
    <div className='w-full h-full '>
        <div
            className="w-full bg-gray-600 h-50 md:h-100 lg:h-100 flex items-center rounded-xl "
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.9)), url(${getImageUrl(
                ImageUrl
                )})`,
                backgroundSize: 'cover',
                backgroundPosition: '60% 20%',
            }}
        >
            <div className='flex-1 h-full p-5 flex items-center'>
                <img className="max-h-full transition-transform duration-500 ease-out group-hover:scale-110" src={getImageUrl(ImageUrl)}/>
            </div>
            <div className='flex-4 h-full p-5 text-white flex flex-col justify-center gap-3'>
                <p className='text-2xl md:text-4xl font-bold font-mono'>{data?.title}</p>
                <p className='max-w-[80%] hidden md:flex text-sm text-zinc-300 font-light font-serif'>{data?.description}</p>
                <div className='flex items-center gap-3'>
                    <p className='font-light text-mist-300'>Duration: {data?.duration}</p>
                    <div className='border border-mist-50 p-2 rounded'> {data?.genre}</div>
                </div>
                
                
            </div>


    </div>
    </div>
  )
}

export default MovieDetails