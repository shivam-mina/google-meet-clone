const express = require('express')
const colors = require('colors')
require('dotenv').config()
const connectDB = require('./config/connectDB')
const bodyParser = require('body-parser')

const authRoute = require('./routes/userRoutes')

// Connection to MongoDb atlas
connectDB()

const app = express()
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`.yellow.underline)
})

// midlleware for x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//middleware for Json parsing
app.use(express.json())

app.use('/api', authRoute)
