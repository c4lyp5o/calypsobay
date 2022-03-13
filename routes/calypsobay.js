// calling all things
const express = require('express');
const router = express.Router();
const bayCommand = require('../controllers/calypsobay');

// init routes
router.get('/', bayCommand.whoAreYou);
router.post('/', bayCommand.whoAreYou_posting);
router.get('/register', bayCommand.registerUserForm);
router.post('/register', bayCommand.registerUser);
router.get('/login', bayCommand.loginUserForm);
router.post('/login', bayCommand.loginUser);
router.get('/bays/:uniqueID', bayCommand.getBay);

module.exports = router;