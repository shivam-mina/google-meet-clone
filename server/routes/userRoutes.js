const express = require('express')
const { Login, Signup, Profile } = require('../controllers/AuthController')
const { userHome } = require('../controllers/HomeController')
const { isAuth } = require('../middlewares/is-Auth')
const router = express.Router()

router.post('/signup', Signup)
router.post('/login', Login)
router.get('/me',isAuth, userHome)
router.get('/profile', Profile)

module.exports = router
