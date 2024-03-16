const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // We will create this next

// Route definitions
router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.post('/login', authController.postLogin);
// Example route for handling logout logic
router.get('/logout', authController.logout);

module.exports = router;
