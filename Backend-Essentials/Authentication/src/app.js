const express = require('express')
const authRoutes = require('../src/routes/auth.routes')

const  app = express()
// MiddleWare
app.use(express.json())

///api/auth is the prefix to use authRoutes
app.use('/api/auth',authRoutes)

module.exports = app