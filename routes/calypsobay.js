// calling all things
const express = require('express');
const router = express.Router();
const bayCommand = require('../controllers/calypsobay');

// init routes
router.get('/', bayCommand.whoAreYou);
router.get('/register', bayCommand.registerUserForm);
router.post('/register', bayCommand.registerUser);
router.get('/login', bayCommand.loginUserForm);
router.post('/login', bayCommand.loginUser);


module.exports = router;