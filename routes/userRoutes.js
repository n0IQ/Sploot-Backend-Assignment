const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.patch('/users/:userId', authController.protect, userController.update);

module.exports = router;
