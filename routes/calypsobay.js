// calling all things
const express = require('express');
const router = express.Router();
const bayCommand = require('../controllers/calypsobay');
// const auth = require('../middleware/calypsobay').verifyToken;
// const alreadyIn = require('../middleware/calypsobay').dontLoginAndRegister;

// init routes
router.get('/', bayCommand.whoAreYou);
router.post('/', bayCommand.whoAreYou_posting);
// router.get('/register', alreadyIn, bayCommand.registerUserForm);
// router.post('/register', bayCommand.registerUser);
// router.get('/login', alreadyIn, bayCommand.loginUserForm);
// router.post('/login', bayCommand.loginUser);
// router.get('/logout', auth, bayCommand.logoutUser);
router.get('/bays/:uniqueID', bayCommand.getBay);

module.exports = router;