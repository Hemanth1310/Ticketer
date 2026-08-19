import express from 'express'
import { prisma } from './prisma.js'
import { PrismaClientKnownRequestError } from '../generated/prisma/internal/prismaNamespace.js'

const router = express.Router()

router.get('/user-details',async(req,res)=>{
    const userEmail = req.userData?.email

    if(!userEmail){
       return res.status(403).json({error:'Invalid token'})
    }
try {
    const user = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { password, ...rest } = user;

    res.status(200).json({
      payload: rest,
      message: "User verified.",
    });
  } catch (err) {
    return res.status(403).json({ error: "User not found." });
  }
})

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("hasAuth");

  res.status(200).json({ message: "Successfully Logged out" });
});

const SEAT_TYPE_MULTIPLIERS: Record<string, number> = {
  SILVER: 1.0,    // Base price
  GOLD: 1.25,     // 25% markup
  PLATINUM: 1.6,  // 60% markup
};

router.get("/showtimes/:id",async(req,res)=>{
    const {id} = req.params

    if(!id){
        return res.status(500).json({error:"Bad request: invalid id"})
    }

    try{    
        const showtimes = await prisma.showtime.findUnique({
            where:{id},
            include:{
                screen:{
                    include:{
                        seats:true,
                    
                    }
                }
            }
        })
        if(!showtimes){
            return res.status(404).json({error:'no shows found'})
        }

        const basePrice = Number(showtimes.basePrice || 10.00);
        const seatsWithPrices = showtimes.screen.seats.map((seat)=>{
            const multiplier = SEAT_TYPE_MULTIPLIERS[seat.type] || 1.0
            const calculatedPrice = Number((basePrice*multiplier).toFixed(2))

            return {
                ...seat,
                price:calculatedPrice
            }
        })

        const seatBookings = await prisma.booking.findMany({
            select:{
               seats:true
            },
             where:{
                showtimeId:id
             }
        })

        const arrOfSeatBookings = seatBookings.flatMap(booking=>booking.seats.map(s=>s.id))


        const seatLocks = await prisma.seatLock.findMany({
            where:{
                showtimeId:id,
                expiresAt: { gt: new Date() }
            },select:{
                seatId:true
            }
        })

        const arrOfSeatLocks = seatLocks.flatMap(lock=>lock.seatId)

        return res.status(200).json({
            payload:{
                showtimes:{
                    ...showtimes,
                    screen:{
                        ...showtimes.screen,
                        seats:seatsWithPrices
                    }
                },
                arrOfSeatBookings,
                arrOfSeatLocks
            }
        })
    }catch(err){
        if(err instanceof PrismaClientKnownRequestError){
                          if(err.code==='P2025'){
                              return res.status(401).json({error:'Show not found'})
                          }
                      }
                return res.status(500).json({error:'Unexpected error occurred'})
    }
})

router.post(('/seatLock/:showtimeId/:seatId'),async(req,res)=>{
    const userId = req.userData?.id
    const {showtimeId, seatId} = req.params

    if(!userId || !showtimeId || !seatId){
        return res.status(405).json({error:"Invalid Request."})
    }

    const FIVE_MINS_MS = 5*60*1000
    const expireAt = Date.now() + FIVE_MINS_MS
    try{
        const existingBooking = await prisma.booking.findMany({
            where:{
                showtimeId
            },select:{
                seats:true
            }
        })

        const arrOfBookedSeats = existingBooking.flatMap(booking=>booking.seats.map(s=>s.id))

        if(arrOfBookedSeats.includes(seatId)){
            return res.status(409).json({ error: 'Seat is already booked.' });
        }

        const activeLock = await prisma.seatLock.findFirst({
            where:{
                seatId,
                showtimeId,
                expiresAt: { gt: new Date() }
            }
        })
        if(activeLock){
            if(activeLock.userId===userId){
                await prisma.seatLock.update({
                    where:{
                        id:activeLock.id,
                    },
                    data:{
                        expiresAt:new Date(expireAt)
                    }
                })
                return res.status(200).json({message:"Extended time limit for a perticular user."})
            }else{
                return res.status(409).json({error:'Seat on hold by other user'})
            }

        }

        const newLock = await prisma.seatLock.create({
            data:{
                seatId,
                showtimeId,
                expiresAt:new Date(expireAt),
                userId
            }
        })

        res.status(201).json({message:'Seat upheld',payload:newLock})
    }catch(err){
        console.error('Seat locking error:', err);
        return res.status(500).json({ error: 'Failed to lock seat' });
    }
})

router.delete('/seatLockDelate/:showtimeId/:seatId',async(req,res)=>{
    const userId = req.userData?.id
    const {showtimeId, seatId} = req.params

    if(!userId || !showtimeId || !seatId){
        return res.status(405).json({error:"Invalid Request."})
    }

    try{
        await prisma.seatLock.deleteMany({
            where:{
                showtimeId,
                seatId,
                userId
            }
        })
       return res.status(200).json({ message: 'Seat unlocked successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to unlock seat' });
        }
})

router.delete('/seatLock/cleanup',async(req, res)=>{

     const userId = req.userData?.id

    if(!userId){
        return res.status(405).json({error:"Invalid Request."})
    }

    try{
        await prisma.seatLock.deleteMany({
            where:{
                userId
            }
        })
       return res.status(200).json({ message: 'Seat unlocked successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to unlock seat' });
        }

})

router.post('/reserveBooking/:showtimeId',async(req,res)=>{
    const {seatIds, ticketPrice, convenienceFee, totalAmount} = req.body 
    const userId = req.userData?.id
    const showtimeId = req.params.showtimeId

    if(!seatIds || !ticketPrice || !convenienceFee || !totalAmount || !userId || !showtimeId){
        return res.status(405).json({error:"Invalid Request."})
    }

    try{
        const booking = await prisma.booking.create({
            data:{
                userId,
                ticketPrice,
                convenienceFee,
                totalAmount,
                showtimeId,
                seats: {
                    connect: seatIds.map((id:string) => ({ id })),
                    },
            },
            include:{
                seats:true
            }
        })

        if(!booking){
            return res.status(409).json({error:'Booking not possible'})
        }

        return res.json({message:'Booking Initiated', payload:{bookingId:booking.id}})
    }catch(err){
        console.error('Booking error:', err);
        return res.status(500).json({ error: 'Failed to lock hold booking' });
    }

})

// router.post('/bookingDetails/:bookingId',async(req,res)=>{
//     const {bookingId} = req.params

//     if(!bookingId){
//         return res.status(405).json({error:"Invalid Request."})
//     }

//     try{
//         const bookingDetails = await prisma.booking.findUnique({
//             where:{
//                 id:bookingId
//             },
//             include:{
//                 seats:true,
//                 showtime:true
//             }
//         })
//         if(!bookingDetails){
//              return res.status(409).json({error:'Booking Details not found'})
//         }

//         return res.json({
//             payload:{
//                 bookingDetails
//             }
//         })
//     }catch(err){
//         console.error('Booking not found:', err);
//         return res.status(500).json({ error: 'Failed to find booking' });
//     }
// })

export default router