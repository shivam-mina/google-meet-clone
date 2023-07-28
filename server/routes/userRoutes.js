const express = require('express')
const { Login, Signup } = require('../controllers/AuthController')
const { Home } = require('../controllers/HomeController')
const router = express.Router()

router.post('/signup', Signup)
router.post('/login', Login)
router.get('/', Home)

module.exports = router
