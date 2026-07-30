import express from 'express'
import { prisma } from './prisma.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

const router = express.Router()

router.get("/all-movies", async (req, res) => {
  try {
    const movies = await prisma.movie.findMany();

    if (movies.length <= 0) {
      return res.status(404).json({ message: "Movies data not found" });
    }

    return res.json({
      payload: {
        movies: movies,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

router.get("/movieDetails/:id",async(req,res)=>{
    const {id} = req.params

    try{
      const movieDetails = await prisma.movie.findUnique({
        where:{id},
        include:{
          showtimes:{
            include:{
              screen:{
                include:{
                  theater:true
                }
              }
            },
            orderBy: {
              startTime: 'asc', 
            },
          }
        }
      })



      if(!movieDetails){
        return res.status(404).json({error:"Movie not found"})
      }

      const dateMap = new Map<string, Map<string, any>>();
      const TIMEZONE = 'Europe/Berlin';

      movieDetails.showtimes.forEach((showtime)=>{
       const { screen, ...showtimeData } = showtime;
    const { theater, ...screenData } = screen;

    const dateObj = new Date(showtimeData.startTime);

    // 1. Get YYYY-MM-DD specifically in CET/CEST
    // Format: "2026-06-24"
    const cetDateKey = dateObj.toLocaleDateString('en-CA', {
      timeZone: TIMEZONE, // Enforces Central European Time
    });

    // 2. Format 24-hour CET time string for display (e.g. "18:30" or "18:30 CET")
    const cetTimeLabel = dateObj.toLocaleTimeString('en-GB', {
      timeZone: TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24-hour format common in CET regions (e.g., "18:30")
    });

    if (!dateMap.has(cetDateKey)) {
      dateMap.set(cetDateKey, new Map());
    }

    const theaterMapForDate = dateMap.get(cetDateKey)!;

    if (!theaterMapForDate.has(theater.id)) {
      theaterMapForDate.set(theater.id, {
        id: theater.id,
        name: theater.name,
        location: theater.location,
        showtimes: [],
      });
    }

    theaterMapForDate.get(theater.id).showtimes.push({
      id: showtimeData.id,
      startTime: showtimeData.startTime,
      timeLabel: `${cetTimeLabel} CET`, // Displays as "18:30 CET"
      screen: {
        id: screenData.id,
        name: screenData.name,
      },
    });
      })
      const {showtimes, ...movie}=movieDetails

      const datesArray = Array.from(dateMap.entries()).map(([date,theaters])=>({
        date,
        theaters:Array.from(theaters.values())

      }))
    

      return res.json({
        payload:{
          ...movie,
          dates:datesArray
        }
      })
    }catch(err){
       if(err instanceof PrismaClientKnownRequestError){
                  if(err.code==='P2025'){
                      return res.status(401).json({error:'User not found'})
                  }
              }
        return res.status(500).json({error:'Unexpected error occurred'})
    }
})


export default router