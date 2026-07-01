import express from 'express'
import { prisma } from './prisma.js'

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


export default router