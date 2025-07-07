require('./config/database')
const express = require('express')
require('dotenv').config()
const cors = require('cors')




const PORT = process.env.PORT || 3578

const userRouter = require('./routes/userRouter')
const dashboardRouter = require('./routes/dashboardRouter')


const app = express()

app.use(cors({origin: "*"}));

app.use(express.json());


app.use(userRouter)
app.use(dashboardRouter)



// app.use((error, req, res, next) => {
//   if(error){
//      return res.status(400).json({message:  error.message})
//   }
//   next()
// })


app.listen(PORT, () => {
  console.log(`my server is running on port ${PORT}`)
})