const express = require('express')
const colors = require('colors')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require("cookie-parser")
require('dotenv').config()

const connectDB = require('./config/connectDB')
const authRoute = require('./routes/userRoutes')
const { errorHandler } = require('./middlewares/error')

// Connection to MongoDb atlas
connectDB()

const app = express()
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`.yellow.underline)
})

//Enabling cookieParser
app.use(cookieParser())

//Enabling cors
app.use(
  cors({
    // origin: "http://localhost:5173",
    credentials: true,
  })
)

// middleware for x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//Error handler middleware
app.use(errorHandler)

//middleware for Json parsing
app.use(express.json())

app.use('/api/users', authRoute)
