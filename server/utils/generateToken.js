const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports.generateToken = (_id) => {
  return jwt.sign({ _id, }, process.env.TOKEN_KEY, {
    expiresIn: '10d',
  })
}
