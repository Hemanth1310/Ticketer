import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import type { BookingDetails } from '../types'
import Loading from '../components/layouts/Loading'
import axios from '../utils/authMiddleware'
import getImageUrl from '../utils/getImageURL'
import Modal from '../components/layouts/Modal'
const BASE_API_URL = import.meta.env.VITE_API_URL

const Checkout = () => {
    const {bookingId} = useParams()
    const [bookingDetails, setBookingDetails] =  useState<BookingDetails|null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isPaymentModalOPen, setISPaymentModalOpen] = useState(false)
    const [isPaymentLoading, setPaymentLoading]=useState(false)
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

     const onClose=()=>{
        setISPaymentModalOpen(false)
      }
      const handlePaymentConfimation = async()=>{
            setPaymentLoading(true)
            try{
                const {data} = await axios.patch(`${BASE_API_URL}/api/private/confirmBooking/${bookingId}`)
                if(!data){
                    throw new Error("Booking Failed")
                }
                navigate(`/booking-details/${data.payload.bookingDetails.id}`)
            }catch{
                console.log('Unable to process booking')
            }finally{
                setPaymentLoading(false)
                onClose()
            }
      }

  return (
    <div className='w-full h-full flex flex-col gap-5 p-5 items-center'>
        <div className='min-w-1/2 border-2 border-brand-primary rounded-lg p-5 flex flex-col items-center'>
            <h3 className='text-xl md:text-2xl mb-10'>Confirm details</h3>
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
          <button onClick={()=>setISPaymentModalOpen(true)} className='h-10 pl-10 pr-10 rounded-lg bg-brand-primary text-white hover:bg-brand-secondary'>
                Proceed To Payment
            </button>

         <Modal isOpen={isPaymentModalOPen} onClose={onClose} title='Payment Gateway'>
                <div className='flex w-full items-center flex-col gap-5'>
                <p>This is demo for payments.</p>
                <button disabled={isPaymentLoading} onClick={handlePaymentConfimation} className='p-2 text-xl border-2 border-brand-primary disabled:border-mist-300 disabled:text-mist-300'>
                    Click to confirm Payment
                </button>
                </div>
            </Modal>

    </div>
  )
}

export default Checkout