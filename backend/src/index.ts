
import express from "express"
const app = express()


const PORT = process.env.PORT || 3008
app.listen(PORT,()=>{
    console.log(`listening at ${PORT}`)
})

