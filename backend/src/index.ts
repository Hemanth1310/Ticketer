
import express from "express"
import AuthRouter from './authRoutes.js'
import cors from 'cors'
import cookieParser from "cookie-parser"
const app = express()


const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:5173", 
      "http://localhost:4173", 
      "https://jobseeker-mern.vercel.app" // Add this as a safety net
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);


app.use(express.json())
app.use(cookieParser())


app.use('/api/auth',AuthRouter)

// app.get('/try',async(req, res)=>{
//     return res.status(200).json({message:"helelow "})
// })


const PORT = process.env.PORT || 3008
app.listen(PORT,()=>{
    console.log(`listening at ${PORT}`)
})

