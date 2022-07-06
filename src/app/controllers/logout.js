// Require Models
const User = require('../models/User')

// Require Other configs
const authConfig = require('../../config/auth')

// Logout
const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies

    if (!cookies?.jwt) {
        return res.sendStatus(204) // No content
    }

    const refreshToken = cookies.jwt

    const user = await User.findOne({ refreshToken })

    if (!user) {
        res.clearCookie('jwt', { httpOnly: true })
        return res.sendStatus(204)
    }

    await User.findByIdAndUpdate(user._id, {
        refreshToken: ''
    }, { new: true })

    res.clearCookie('jwt', { httpOnly: true }) // secure: true - only serves on https
    res.sendStatus(204)
}

module.exports = { handleLogout }