const express = require('express')
const { Login, Signup } = require('../controllers/AuthController')
const { userHome } = require('../controllers/HomeController')
const router = express.Router()

router.post('/signup', Signup)
router.post('/login', Login)
router.get('/me', userHome)

module.exports = router
