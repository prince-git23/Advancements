const express = require('express')
const authRoutes = require('../src/routes/auth.routes')
const cookieParser = require('cookie-parser')

const  app = express()
// MiddleWare
app.use(express.json())
app.use(cookieParser())

///api/auth is the prefix to use authRoutes
app.use('/api/auth',authRoutes)

module.exports = app