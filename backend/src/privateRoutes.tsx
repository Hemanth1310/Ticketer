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

        const seatBookings = await prisma.booking.findMany({
            select:{
               seatId:true
            },
             where:{
                showtimeId:id
             }
        })

        const seatLocks = await prisma.seatLock.findMany({
            where:{
                showtimeId:id
            },select:{
                seatId:true
            }
        })

        if(!showtimes){
            return res.status(404).json({error:'no shows found'})
        }

        return res.status(200).json({
            payload:{
                showtimes,
                seatBookings,
                seatLocks
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

export default router