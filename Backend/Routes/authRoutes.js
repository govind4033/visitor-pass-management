const express = require('express');
const { register, login, getMe } = require('../Controllers/authController');
const router = express.Router();
const upload = require("../Middleware/uploadMiddleware");


// simple routes register, login and stored token login
router.post('/register', upload.single('photo'), register);
router.post('/login', login);
router.get('/me', getMe);

module.exports = router;