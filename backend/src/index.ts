
import express from "express"
import AuthRouter from './authRoutes.js'
import PublicRoutes from './publicRoutes.js'
import cors from 'cors'
import cookieParser from "cookie-parser"
import path from "path"
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
app.use('/api/public',PublicRoutes)
// app.get('/try',async(req, res)=>{
//     return res.status(200).json({message:"helelow "})
// })

const publicPath = path.join(__dirname, '..',"public")

app.use('/images',express.static('public'))

app.get('/images/:filename',(req,res)=>{
    const filename = req.params.filename
    const imagePath = path.join(publicPath,filename)

    if(!imagePath){
        res.status(400).json({
            message:"Invalid method."
        })
    }

    res.sendFile(imagePath,(err)=>{
        res.status(405).json({
            message:'Image not found'
        })
    })
})


const PORT = process.env.PORT || 3008
app.listen(PORT,()=>{
    console.log(`listening at ${PORT}`)
})

