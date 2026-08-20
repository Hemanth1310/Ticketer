import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import type { BookingDetails } from '../types'
import Loading from '../components/layouts/Loading'
import axios from '../utils/authMiddleware'
import getImageUrl from '../utils/getImageURL'
import Modal from '../components/layouts/Modal'
const BASE_API_URL = import.meta.env.VITE_API_URL

const BookingDetails = () => {
    const {bookingId} = useParams()
      const [bookingDetails, setBookingDetails] =  useState<BookingDetails|null>(null)
        const [isLoading, setIsLoading] = useState(false)
        const [isError, setIsError] = useState(false)
        const navigate = useNavigate()

     useEffect(()=>{ 
        const fetchBooking=async()=>{
            setIsLoading(true)
            setIsError(false)
            try{
                const {data} = await axios.get(`${BASE_API_URL}/api/private/bookingDetails/${bookingId}`)
                console.log(data)
                setBookingDetails(data.payload.bookingDetails as BookingDetails)
            }catch{
                setIsError(true)
                console.log('Failed to fetch booking details')
            }finally{
                setIsLoading(false)
            }
        }
        fetchBooking()
    },[bookingId])

      if (isLoading) {
        return <Loading />;
    }
    if (isError || !bookingDetails) {
        return (
          <div className="w-full h-screen flex flex-col gap-5 font-mono italic text-gray-500 items-center justify-center text-3xl">
            "Failed to load the page"
          </div>
        );
    }
  return (
    <div className='w-full h-full flex flex-col gap-5 p-5 items-center'>
        <div className='min-w-1/2 border-2 border-brand-primary rounded-lg p-5 flex flex-col items-center'>
            <h3 className='text-xl md:text-2xl mb-10'>Thank You for choosing us!</h3>
            <div className='w-full flex flex-col md:flex-row gap-5'>
                <div className='h-full flex-1 flex flex-col gap-5 items-center'>
                     <img
                                    className="h-50 md:h-80"
                                    src={getImageUrl(bookingDetails.movie.imagePath)}
                                />
                    <div>
                                <p className='text-xl font-bold'>{bookingDetails.movie.title}</p>
                                <p className=' text-mist-700'>{bookingDetails.movie.genre} | {bookingDetails.movie.duration}mins</p>
                    </div>
                    
                </div>
                <div className='flex-1 flex flex-col items-center gap-5'>
                    <div className='flex flex-col items-center gap-3'>
                        <h2 className='text-xl md:text-2xl text-brand-primary'>{bookingDetails.status}</h2>
                        <p>{new Date(bookingDetails.showtime.startTime).toDateString()}</p>
                        <p>{new Date(bookingDetails.showtime.startTime).toLocaleTimeString()}hr</p> 
                        <span className='w-full h-0.5 bg-mist-700'></span>
                        <p className='font-bold'>{bookingDetails.screen}</p>
                         <p>@{bookingDetails.theater}</p>
                        <p>{bookingDetails.location}</p>
                        <span className='w-full h-0.5 bg-mist-700'></span>
                       
                    </div>
                     <div className=' w-full border border-mist-700 p-5 rounded-lg flex flex-col gap-3'>
                        <div className='flex w-full justify-between'>
                            <p>Ticket price: </p>
                            <p>${bookingDetails.ticketPrice}</p>
                        </div>
                        <div className='flex w-full justify-between'>
                            <p>Convinience Fee: </p>
                            <p>${bookingDetails.convenienceFee}</p>
                        </div>
                        <div className='flex flex-col w-full justify-between gap-3'>
                            <span className='w-full h-0.5 bg-mist-700'></span>
                            <div className='flex w-full justify-between'>
                            <p className='font-bold'>Total Amount: </p>
                            <p className='font-bold'>${bookingDetails.totalAmount}</p>
                            </div>
                        </div>
                     </div>

                </div>
            </div>
        </div>
          <button onClick={()=>navigate('/')} className='h-10 pl-10 pr-10 rounded-lg bg-brand-primary text-white hover:bg-brand-secondary'>
                Go To Home
            </button>


    </div>
  )
}

export default BookingDetails