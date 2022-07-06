const express = require('express')
const router = express.Router()
const logoutController = require('../controllers/logout')

router.get('/', logoutController.handleLogout)

// Exports
module.exports = app => app.use('/logout', router)