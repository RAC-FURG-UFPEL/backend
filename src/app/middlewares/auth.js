const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')

// DotEnv
require('dotenv').config()

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).send({ error: 'No token provided' })
    }

    const parts = authHeader.split(' ')

    if(!parts.length === 2){
        return res.status(401).send({ error: 'Token error' })
    }

    const [ scheme, token ] = parts

    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({ error: 'Malformatted token' })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).send({ error: 'Invalid token' })
        }

        req.userId = decoded.id
        return next()
    })
}