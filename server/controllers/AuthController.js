const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { generateToken } = require('../utils/GenerateToken')
const jwt = require('jsonwebtoken')

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const Signup = async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      res.status(400).json({ message: 'Please add all fields' })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(403).json({ message: 'User already exists' })
    }
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new User
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    res.status(201).json({ message: 'success', user: newUser })
  } catch (error) {
    console.log(error)
  }
}

// @desc    Authenticate a user
// @route   POST /api/login
// @access  Public
const Login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ message: 'Please add all fields' })
    }
    // Check for user email
    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      return res.status(404).json({ message: 'User not Found' })
    }

    // Check for correct password
    if (await bcrypt.compare(password, existingUser.password)) {
      // Generating Jsonwebtoken
      const token = generateToken(existingUser._id)
      res.cookie('token', token, {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
        withCredentials: true,
      })
      res.status(200).json({ message: 'success', user: existingUser })
    } else {
      res.status(401).json({ message: 'wrong password' })
    }
  } catch (error) {
    console.log(error)
  }
}

const Profile = async (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      res.status(401).json({ message: 'Bad Token' })
    }

    const user = await User.findById(data._id)

    const profile = {
      _id: user._id,
      username: user.username,
      email : user.email,
    }
    if (user) {
      res.status(200).json({ message: 'Verified', user:profile })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
}

module.exports = {
  Signup,
  Login,
  Profile,
}
