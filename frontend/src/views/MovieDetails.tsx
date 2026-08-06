import { useNavigate, useParams } from "react-router";
import { useMovieDetails } from "../utils/hooks/dataQueryHook";
import MovieDetailsSkeleton from "../components/layouts/MovieDetailsSkeleton";
import getImageUrl from "../utils/getImageURL";
import AuthLayout from "../components/layouts/AuthLayout";
import { useAuthContextData } from "../utils/useAuthContextData";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

const MovieDetails = () => {
  const { id } = useParams();
  const { data, isError, isLoading, refetch } = useMovieDetails(id);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const {userDetails} = useAuthContextData()
    const navigate=useNavigate()
  
    const closeModal=() =>{
      setIsModalOpen(false)
    }

    const handleSeatSelection = (sid:string)=>{
        if(!userDetails){
            setIsModalOpen(true)
        }else{
            navigate(`/book-show-time/${id}/${sid}`)
        }
    }

  if (isLoading) {
    return <MovieDetailsSkeleton />;
  }
  if (isError || !data ||!id) {
    return (
      <div className="w-full h-screen flex flex-col gap-5 font-mono italic text-gray-500 items-center justify-center text-3xl">
        "Failed to load the page"
        <span className="text-brand-primary" onMouseDown={() => refetch()}>
          Refetch
        </span>
      </div>
    );
  }

  const ImageUrl = data ? data.imagePath : "";

  return (
    <div className="w-full h-full ">
      <div
        className="w-full bg-gray-600 h-50 md:h-100 lg:h-100 flex items-center rounded-xl "
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.9)), url(${getImageUrl(
            ImageUrl,
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "60% 20%",
        }}
      >
        <div className="flex-1 h-full p-5 flex items-center">
          <img
            className="max-h-full transition-transform duration-500 ease-out group-hover:scale-110"
            src={getImageUrl(ImageUrl)}
          />
        </div>
        <div className="flex-4 h-full p-5 text-white flex flex-col justify-center gap-3">
          <p className="text-2xl md:text-4xl font-bold font-mono">
            {data?.title}
          </p>
          <p className="max-w-[80%] hidden md:flex text-sm text-zinc-300 font-light font-serif">
            {data?.description}
          </p>
          <div className="flex items-center gap-3">
            <p className="font-light text-mist-300">
              Duration: {data?.duration}
            </p>
            <div className="border border-mist-50 p-2 rounded">
              {" "}
              {data?.genre}
            </div>
          </div>
        </div>
      </div>
       <div className="mt-5 flex items-center hover:underline cursor-pointer" onClick={()=>navigate('/')}>
        <ChevronLeft size={24} />
        View All Movies</div>
      <div className="mt-10 w-full flex flex-col gap-10">
        {/* {data.theaterDetails.map((theater)=>
        <div key={theater.id} className='w-full '>
            <h1 className='text-2xl md:text-3xl '>{theater.name} - <span className='font-light'>{theater.location}</span></h1>
            <div className='mt-1 w-1/5 h-0.5 bg-brand-primary'></div>
            <div className=''>
                {theater.showtimes.map(showtime=>
                    <div>{new Date(showtime.startTime).toLocaleDateString()}</div>
                )}
            </div>
            
        </div>)} */}


        {data.dates.map((dateData) => (
          <div>
            <h1 className="text-2xl md:text-3xl ">
              {new Date(dateData.date).toDateString()}
            </h1>
            <div className="mt-1 w-1/5 h-0.5 bg-brand-primary"></div>
            {dateData.theaters.map((theater) => (
              <div key={theater.id} className="border p-4 rounded-xl mb-4 mt-4">
                <h3 className="font-bold text-lg">{theater.name}</h3>
                <p className="text-sm text-gray-500">{theater.location}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {theater.showtimes.map((st) => (
                    <button
                      key={st.id}
                      className="px-4 py-2 border border-brand-primary  rounded-lg hover:bg-brand-primary hover:text-white transition-colors text-sm font-semibold"
                      onClick={()=>handleSeatSelection(st.id)}
                    >
                      {/* Render timeLabel ("06:30 PM") instead of the full Date */}
                      {st.timeLabel}
                      <span className="block text-xs font-normal opacity-75">
                        {st.screen.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
        <AuthLayout
      isOpen={isModalOpen}
      onClose={closeModal}
      />
    </div>
  );
};

export default MovieDetails;
