import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import type { Seat, ShowTimeData } from '../types'
import Loading from '../components/layouts/Loading'
import axios from '../utils/authMiddleware'
import { Clapperboard } from 'lucide-react'

const BASE_API_URL = import.meta.env.VITE_API_URL

const ShowtimeBooking = () => {
    const {name,genre,id} = useParams()
    const [showtimeData, setShowTimeData] = useState<ShowTimeData|null>(null)
    const [seatLocks, setSeatLocks] = useState<string[]>([])
    const [seatBookings, setSeatBookings] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [seatPicks, setSeatPicks] = useState<string[]>([])
    const [totalSum, setTotalSum] = useState(0)
    const [seatSplits, setSeatSplit] = useState({
        "SILVER":[],
        "GOLD":[],
        "PLATINUM":[]
    })
     
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

        const sortedSeats = Array.from(map.entries()).sort(([rowA],[rowB])=>rowB.localeCompare(rowA))

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

    
      const handleSeatPicks = (id:string,index:number,sid:number)=>{

        if(seatPicks.includes(id)){
             setSeatPicks((prev) =>
               prev.filter((seatId) => seatId !== id)
            );
              const seat=groupedSeats[index][1][sid]
            setTotalSum(prev=>prev-seat.price)
            const seatNum = seat.row+seat.number
            setSeatSplit(prev=>({...prev,[seat.type]:prev[seat.type].filter(st=>st!==seatNum)}))
        }else{
            setSeatPicks((prev) =>
               [...prev,id]
            );
            const seat=groupedSeats[index][1][sid]
            setTotalSum(prev=>prev+seat.price)
            setSeatSplit(prev=>({...prev,[seat.type]:[...prev[seat.type],seat.row+seat.number]}))
        }
       
        
      }
      
      const seatbg=(id:string)=>{
        let color
        if(seatPicks.includes(id)){
            color="bg-brand-forth"
        }
        return color
      }

      const seatTypeColor = (type:string)=>{
        if(type==='PLATINUM'){
            return "border-mist-900"
        }else if(type==='GOLD'){
            return "border-yellow-600"
        }else{
            return "border-mist-300"
        }
        
      }
      

   
  return (
     <div className='w-full h-full flex flex-col gap-5 md:gap-0 md:flex-row items-center'>
        <div className='flex-5'>
                <div className='w-full'>
                    <p className=' text-center text-2xl font-bold'> {name}</p>
                    <p className=' text-center text-mist-700 text-xl'>{genre}</p>
                
                </div>
            <div className="flex flex-wrap flex-col items-center justify-between mt-10">
                <div className='h-2 w-50 bg-mist-600'></div>
                <p>Screen</p>
                {groupedSeats.map((row,index)=>
                <div className='flex gap-5 items-center mt-3'>
                    {row[0]} 
                    <div className='flex gap-3'>
                        {row[1].map((seat,sid)=><button disabled={seatBookings.includes(seat.id) || seatLocks.includes(seat.id)} onClick={()=>handleSeatPicks(seat.id,index,sid)} className={`border ${seatTypeColor(seat.type)} h-6 w-6 md:h-10 md:w-10 flex items-center justify-center ${seatbg(seat.id)}`}>{seat.number}</button>)}
                    </div>
                </div>)}
                </div>
        </div>
        <div className='flex-2 h-2/3 border border-brand-primary rounded-2xl p-5'>
            {seatPicks.length>0 ? <div className='w-full h-full flex flex-col items-center  gap-5'>
            <p className='text-xl font-bold'>Seats Seleted</p>
            <div className='w-full h-1/2 border border-zinc-400 p-5 flex flex-col justify-between'>
            <div className='flex flex-col gap-2'>
                {seatSplits.PLATINUM.length>0 &&
                <div className='flex justify-between'>
                    <div className='flex'>
                    <p>Platinum:</p>
                    {seatSplits.PLATINUM.map((seat,i)=><span>{seat}{seatSplits.PLATINUM.length-1>i && ','}</span>)}
                    </div>
                    <div>
                       X {seatSplits.PLATINUM.length}
                    </div>
                </div>}
                {seatSplits.GOLD.length>0 &&
                <div className='flex justify-between'>
                    <div className='flex'>
                    <p>Gold:</p>
                    {seatSplits.GOLD.map((seat,i)=><span>{seat}{seatSplits.GOLD.length-1>i && ','}</span>)}
                    </div>
                    <div>
                       X {seatSplits.GOLD.length}
                    </div>
                </div>}
                {seatSplits.SILVER.length>0 &&
                <div className='flex justify-between'>
                    <div className='flex'>
                    <p>Silver:</p>
                    {seatSplits.SILVER.map((seat,i)=><span>{seat}{seatSplits.SILVER.length-1>i && ','}</span>)}
                    </div>
                    <div>
                       X {seatSplits.SILVER.length}
                    </div>
                </div>}
                </div>
                <div>
                    <div className='w-full h-0.5 bg-brand-primary'></div>
                        <div className='flex justify-between'>
                            <div className='flex'>
                               <p>TOTAL:</p>
                            </div>
                            <div>
                                ${totalSum}
                            </div>
                    </div>
                </div>
            </div>
            <div className=' flex-1 h-full flex flex-col justify-between'>
                <p>*The amount excludes CONVENIENCE_FEE</p>
            <button className='h-10 w-full bg-brand-primary text-white'>Check and pay</button>
           
            </div>
            
            </div>:
            <div className='w-full h-full flex flex-col items-center justify-center gap-5'>
                <Clapperboard size={38} color="#BE1A1A"/>
                <h3 className='text-xl font-bold text-center'>The Abosulte cinema expreience</h3>
                <p className='text-2xl text-center'>Please select seats to continue.</p>
            </div>}
            
            
        </div>
    </div>
  )
}

export default ShowtimeBooking