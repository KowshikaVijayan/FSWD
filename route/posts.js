const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to check authentication
function authenticate(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/auth/login');
    try {
        const decoded = jwt.verify(token, 'supersecretkey');
        req.user = decoded.id;
        next();
    } catch {
        return res.redirect('/auth/login');
    }
}

// Post content
router.post('/create', authenticate, async (req, res) => {
    try {
        const post = new Post({ content: req.body.content, user: req.user });
        await post.save();
        res.redirect('/');
    } catch (error) {
        res.status(400).send('Error creating post');
    }
});

// Get posts for user's feed (people they follow)
router.get('/feed', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user).populate('following');
        const posts = await Post.find({ user: { $in: user.following } }).populate('user');
        res.json(posts);
    } catch (error) {
        res.status(400).send('Error fetching feed');
    }
});

module.exports = router;