const express = require('express')
const authController = require('../controllers/auth.controller')


const router = express.Router()

router.post('/register',authController.registerUSer)
router.post("/login",authController.loginUser)
router.post('/logout',authController.logoutUser)

module.exports = router
