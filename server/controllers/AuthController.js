const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { generateToken } = require('../utils/GenerateToken')

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
      const token = generateToken(existingUser._id);
      res.cookie("token",token,{
        secure: true,
        sameSite: "none",
        httpOnly: true,
        withCredentials: true
      })
      res.status(200).json({ message: 'login success', user: existingUser })
    } else {
      res.status(401).json({ message: 'wrong password' })
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  Signup,
  Login,
}
