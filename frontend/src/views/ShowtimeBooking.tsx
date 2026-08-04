import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import type { Seat, ShowTimeData } from '../types'
import Loading from '../components/layouts/Loading'
import axios from '../utils/authMiddleware'

const BASE_API_URL = import.meta.env.VITE_API_URL

const ShowtimeBooking = () => {
    const {name,genre,id} = useParams()
    const [showtimeData, setShowTimeData] = useState<ShowTimeData|null>(null)
    const [seatLocks, setSeatLocks] = useState<string[]>([])
    const [seatBookings, setSeatBookings] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    useEffect(()=>{
        const fetchSeatInfo=async()=>{
            setIsLoading(true)
            setIsError(false)
            try{
                const {data} = await axios.get(`${BASE_API_URL}/api/private/showtimes/${id}`)

                if(data.payload?.showtimes){
                    setShowTimeData(data.payload?.showtimes as ShowTimeData)
                }

               if(data.payload?.seatBookings){
                    setSeatBookings(data.payload?.seatBookings as string[])
                }

                if(data.payload?.seatLocks){
                    setSeatLocks(data.payload?.seatLocks as string[])
                }

                console.log(data)
            }catch{
                setIsError(true)
            }
            setIsLoading(false)
        }
        fetchSeatInfo()
    },[id])

    const groupedSeats = useMemo(()=>{
        const seats = showtimeData?.screen.seats||[]
        const map = new Map<string, Seat[]>()

        seats.forEach((seat)=>{
            if(!map.has(seat.row)){
                map.set(seat.row,[])
            }
            map.get(seat.row)?.push(seat)
        })

        const sortedSeats = Array.from(map.entries()).sort(([rowA],[rowB])=>rowA.localeCompare(rowB))

        sortedSeats.forEach(([,seatList])=>{
            seatList.sort((a,b)=>a.number-b.number)
        })

        return sortedSeats
    },[showtimeData])

    if (isLoading) {
        return <Loading />;
      }
      if (isError || !showtimeData) {
        return (
          <div className="w-full h-screen flex flex-col gap-5 font-mono italic text-gray-500 items-center justify-center text-3xl">
            "Failed to load the page"
          </div>
        );
      }

    

      

   
  return (
     <div className='w-full h-full '>
        <div className='w-full'>
            <p className=' text-center text-2xl font-bold'> {name}</p>
            <p className=' text-center text-mist-700 text-xl'>{genre}</p>
           
        </div>
       <div className="flex flex-wrap flex-col items-center justify-between mt-10">
        <div className='h-2 w-50 bg-mist-600'></div>
        <p>Screen</p>
        {groupedSeats.map(row=>
        <div className='flex gap-5 items-center mt-3'>
            {row[0]} 
            <div className='flex gap-3'>
                {row[1].map(seat=><button className='border border-mist-900 h-6 w-6 md:h-10 md:w-10 flex items-center justify-center'>{seat.number}</button>)}
            </div>
        </div>)}
        </div>
    </div>
  )
}

export default ShowtimeBooking