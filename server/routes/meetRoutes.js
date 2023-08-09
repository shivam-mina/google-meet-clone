const { onlineUsers } = require('../controllers/meetController')
const express = require('express')
const router = express.Router()

router.get('/onlineusers', onlineUsers)

module.exports = router
