const express = require('express');
const router = express.Router();
const signup = require('./signup');
const signin = require('./signin');
const posts = require('./posts');
const profile = require('./profile');
const forgetPassword = require('./forgetPassword');

router.use('/api/signup', signup);
router.use('/api/signin', signin);
router.use('/api/profile', profile);
router.use('/api/forgetpassword', forgetPassword);
router.use('/api/posts', posts);


module.exports = router;