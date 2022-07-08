// Require Packages
const express = require('express')
const router = express.Router()

const Post = require('../models/Post')

// Middleware
//router.use(authMiddleware)
const authMiddleware = require('../middlewares/auth')

// List
router.get('/', async (req, res) => {
    try {

        const posts = await Post.find().populate('author').sort({ _id: -1 })

        return res.send({ posts })

    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Cannot list posts' })
    }
})

// Create
router.post('/', authMiddleware, async (req, res) => {
    try {

        const post = await Post.create({ ...req.body, author: req.userId })

        return res.send(post)

    } catch (err) {
        console.log(err)

        return res.status(400).send({ error: 'Cannot create post' })
    }
})

// Read
router.get('/:postId/:quant?', async (req, res) => {
    try {

        if (req.params.postId === '*') {

            const posts = await Post.find().populate('author').sort({ _id: -1 }).limit(req.params.quant)

            return res.send({ posts })
        } else if (req.params.postId === "title") {
            
            const posts = await Post.find( { url_title: req.params.quant } ).populate('author')

            return res.send({ posts })

        } else {
            
            const posts = await Post.findById(req.params.postId).populate('author')

            return res.send({ posts })
        }
    } catch (err) {

        return res.status(400).send({ error: 'Cannot find Post' })

    }
})

// Update
router.put('/:postId', authMiddleware, async (req, res) => {
    try {

        const { domain, expirationDate, startDate, checkInterval, completed } = req.body

        const post = await Post.findByIdAndUpdate(req.params.postId, {
            title,
            content
        }, { new: true })

        await Post.save()

        return res.send(post)

    } catch (err) {
        return res.status(400).send({ error: 'Cannot find Post' })
    }
})

// Delete
router.delete('/:postId', authMiddleware, async (req, res) => {
    try {

        await Post.findByIdAndRemove(req.params.postId).populate('author')

        return res.send({ message: 'Deleted' })

    } catch (err) {
        return res.status(400).send({ error: 'Cannot delete post' })
    }
})

// Export
module.exports = app => app.use('/posts', router)