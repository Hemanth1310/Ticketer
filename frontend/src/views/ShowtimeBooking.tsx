import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import type { Seat, ShowTimeData } from '../types'
import Loading from '../components/layouts/Loading'
import axios from '../utils/authMiddleware'
import { ChevronLeft, Clapperboard } from 'lucide-react'
import { useMovieDetails } from '../utils/hooks/dataQueryHook'
import getImageUrl from '../utils/getImageURL'
import Modal from '../components/layouts/Modal'
import Timer from '../components/layouts/Timer'


const BASE_API_URL = import.meta.env.VITE_API_URL

const ShowtimeBooking = () => {
    const {mid,id} = useParams()
    const { data, isError, isLoading } = useMovieDetails(mid);
    const timerRef = useRef(0)
    const [showtimeData, setShowTimeData] = useState<ShowTimeData|null>(null)
    const [seatLocks, setSeatLocks] = useState<string[]>([])
    const [seatBookings, setSeatBookings] = useState<string[]>([])
    const [isCompLoading, setIsCompLoading] = useState(false)
    const [isCompError, setIsCompError] = useState(false)
    const [seatPicks, setSeatPicks] = useState<string[]>([])
    const [totalSum, setTotalSum] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSeatLockModalOpen, setIsSeatLockModalOpen] = useState(false)
    const [catPrices, setCatPrices] = useState({   
        "SILVER":0,
        "GOLD":0,
        "PLATINUM":0
    })
    const [seatSplits, setSeatSplit] = useState({   
        "SILVER":[],
        "GOLD":[],
        "PLATINUM":[]
    })
     const navigate=useNavigate()
     const FIVE_MINS_MS = 5*60*1000
    useEffect(()=>{
        timerRef.current=Date.now()
      },[])
   
    useEffect(()=>{
        const fetchSeatInfo=async()=>{
            setIsCompLoading(true)
            setIsCompError(false)
            try{
                const {data} = await axios.get(`${BASE_API_URL}/api/private/showtimes/${id}`)

                if(data.payload?.showtimes){
                    setShowTimeData(data.payload?.showtimes as ShowTimeData)
                }

               if(data.payload?.arrOfSeatBookings){
                    setSeatBookings(data.payload?.arrOfSeatBookings as string[])
                }

                if(data.payload?.arrOfSeatLocks){
                    setSeatLocks(data.payload?.arrOfSeatLocks as string[])
                }

                console.log(data)
            }catch{
                setIsCompError(true)
            }
            setIsCompLoading(false)
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
            if(!catPrices[seat.type]){
                setCatPrices(prev=>({...prev, [seat.type]:seat.price}))
            }
        })

        const sortedSeats = Array.from(map.entries()).sort(([rowA],[rowB])=>rowB.localeCompare(rowA))

        sortedSeats.forEach(([,seatList])=>{
            seatList.sort((a,b)=>a.number-b.number)
        })

        return sortedSeats
    },[showtimeData])

    if (isLoading || isCompLoading) {
        return <Loading />;
      }
      if (isError || !showtimeData || isCompError ||!data) {
        return (
          <div className="w-full h-screen flex flex-col gap-5 font-mono italic text-gray-500 items-center justify-center text-3xl">
            "Failed to load the page"
          </div>
        );
      }

    
      const handleSeatPicks = async(id:string,index:number,sid:number)=>{

        if(seatPicks.includes(id)){
             setSeatPicks((prev) =>
               prev.filter((seatId) => seatId !== id)
            );

            try{
                await axios.delete(`${BASE_API_URL}/api/private/seatLockDelate/${showtimeData.id}/${id}`)
                 const seat=groupedSeats[index][1][sid]
                setTotalSum(prev=>prev-seat.price)
                const seatNum = seat.row+seat.number
                setSeatSplit(prev=>({...prev,[seat.type]:prev[seat.type].filter(st=>st!==seatNum)}))
            
                }catch{
                    setIsSeatLockModalOpen(true)
                }
           }else{
            setSeatPicks((prev) =>
               [...prev,id]
            );
            try{
                await axios.post(`${BASE_API_URL}/api/private/seatLock/${showtimeData.id}/${id}`)
                const seat=groupedSeats[index][1][sid]
                setTotalSum(prev=>prev+seat.price)
                setSeatSplit(prev=>({...prev,[seat.type]:[...prev[seat.type],seat.row+seat.number]}))
            }catch(err){
                setSeatPicks((prev) =>
                    prev.filter((seatId) => seatId !== id)
                );
                setIsSeatLockModalOpen(true)
                console.log('Unbale to book please try again later'+err)
            }
           
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

      const onExpiry=async()=>{
        try{
            await axios.post(`${BASE_API_URL}/api/private/seatLock/cleanup`)
        }catch{
            console.log('seat unloack failed')
        }
        setIsModalOpen(true)
      }

      const onClose=()=>{
        setIsModalOpen(false)
        window.location.reload()
      }
     
  return (
     <div className='w-full h-full flex flex-col gap-5 md:gap-0 md:flex-row items-center'>
        <div className='flex-5'>
                <div className='w-full flex items-center justify-between'>
                    <div className='flex-1 flex items-center'>
                        <ChevronLeft size={32} onClick={()=>navigate(-1)}/>
                        <div className='flex items-center gap-4'>
                            <img
                                    className="h-15 md:h-24"
                                    src={getImageUrl(data?.imagePath)}
                                />
                            <div>
                                <p className='text-xl font-bold'>{data?.title}</p>
                                <p className=' text-mist-700'>{data?.genre} | {data.duration}mins</p>
                            </div>
                        
                        </div>
                    </div>
                    <div className='flex-1'>
                        <Timer duration={FIVE_MINS_MS} onExpiry={onExpiry}/>
                    </div>
                    <div>

                    </div>
                
                </div>
            <div className="flex flex-wrap flex-col items-center justify-between mt-10">
                <div className='h-2 w-50 bg-mist-600'></div>
                <p>Screen</p>
                {groupedSeats.map((row,index)=>
                <div key={row[0]} className='flex gap-5 items-center mt-3'>
                    {row[0]} 
                    <div className='flex gap-3'>
                        {row[1].map((seat,sid)=><button key={seat.id} disabled={seatBookings.includes(seat.id) || seatLocks.includes(seat.id)} onClick={()=>handleSeatPicks(seat.id,index,sid)} className={`border ${seatTypeColor(seat.type)} h-6 w-6 md:h-10 md:w-10 flex items-center justify-center rounded ${seatbg(seat.id)}`}>{seat.number}</button>)}
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
                    {seatSplits.PLATINUM.map((seat,i)=><span key={seat}>{seat}{seatSplits.PLATINUM.length-1>i && ','}</span>)}
                    </div>
                    <div>
                       ${catPrices.PLATINUM} X {seatSplits.PLATINUM.length}
                    </div>
                </div>}
                {seatSplits.GOLD.length>0 &&
                <div className='flex justify-between'>
                    <div className='flex'>
                    <p>Gold:</p>
                    {seatSplits.GOLD.map((seat,i)=><span key={seat}>{seat}{seatSplits.GOLD.length-1>i && ','}</span>)}
                    </div>
                    <div>
                       ${catPrices.GOLD} X {seatSplits.GOLD.length}
                    </div>
                </div>}
                {seatSplits.SILVER.length>0 &&
                <div className='flex justify-between'>
                    <div className='flex'>
                    <p>Silver:</p>
                    {seatSplits.SILVER.map((seat,i)=><span key={seat}>{seat}{seatSplits.SILVER.length-1>i && ','}</span>)}
                    </div>
                    <div>
                       ${catPrices.SILVER} X {seatSplits.SILVER.length}
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
                                ${totalSum.toFixed(2)}
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
                <div className='w-full flex flex-col gap-5'>
                    <div className={`w-full p-2 flex justify-between border ${seatTypeColor('PLATINUM')}`}>

                        <p>PLATINUM</p>
                        <p>${catPrices['PLATINUM']}</p>
                    </div>
                    <div className={`w-full p-2 flex justify-between border ${seatTypeColor('GOLD')}`}>
                        <p>GOLD</p>
                        <p>${catPrices['GOLD']}</p>
                    </div>
                    <div className={`w-full p-2 flex justify-between border ${seatTypeColor('SILVER')}`}>
                        <p>SILVER</p>
                        <p>${catPrices['SILVER']}</p>
                    </div>

                </div>
            </div>}
            
            <Modal isOpen={isModalOpen} onClose={onClose} title='Session Timeout'>
                <div className='flex w-full items-center flex-col gap-5'>
                <p>Your session is timed out</p>
                <button onClick={onClose} className='p-2 text-xl border-2 border-brand-primary'>Click to restart the session</button>
                </div>
            </Modal>
             <Modal isOpen={isSeatLockModalOpen} onClose={onClose} title='Unable to process Request'>
                <div className='flex w-full items-center flex-col gap-5'>
                <p>Currently unable to process the booking</p>
                <button onClick={onClose} className='p-2 text-xl border-2 border-brand-primary'>Click to restart the session and try again</button>
                </div>
            </Modal>
        </div>
    </div>
  )
}

export default ShowtimeBooking