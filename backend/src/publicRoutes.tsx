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
            }
          }
        }
      })

      if(!movieDetails){
        return res.status(404).json({error:"Movie not found"})
      }

      const theaterMap = new Map()

      movieDetails.showtimes.forEach((showtime)=>{
        const {screen,...showtimeData} = showtime
        const {theater, ...screenData} = screen

        if(!theaterMap.has(theater.id)){
          theaterMap.set(theater.id,{
            id: theater.id,
            name: theater.name,
            location: theater.location,
            showtimes: [],
          })
        }

        theaterMap.get(theater.id).showtimes.push({
          id: showtimeData.id,
          startTime: showtimeData.startTime,
          screen: {
            id: screenData.id,
            name: screenData.name,
          },
        })
      })
      const {showtimes, ...movie}=movieDetails

      return res.json({
        payload:{
          movie,
          theaterDetails:Array.from(theaterMap.values())
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