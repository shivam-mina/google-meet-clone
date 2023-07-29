const jwt = require('jsonwebtoken')
require('dotenv').config()

const User = require('../models/User')

module.exports.isAuth = (req, res) => {
  const token = req.cookies.token

  if (!token) {
    res.status(401)
    throw new Error('No token')
  }
   
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
      if (err) {
        res.status(401).json({ message: 'Bad Token' })
      }
      const user = await User.findById(data._id)

      if (user) {
        res.status(200).json({ message: 'Verified', user })
      } else {
         res.status(404)
        throw new Error('User not found')
      }
    })
  }