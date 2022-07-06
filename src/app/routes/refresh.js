const express = require('express')
const router = express.Router()
const refreshTokenController = require('../controllers/refreshToken')

router.get('/', refreshTokenController.handleRefreshToken)

// Exports
module.exports = app => app.use('/refresh', router)