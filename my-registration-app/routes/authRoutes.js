const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // We will create this next

// Route definitions
router.get('/pstart', authController.getpstart);
router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.post('/login', authController.postLogin);
// Example route for handling logout logic
router.get('/logout', authController.logout);
router.get('/campaignmanager', authController.getCampaignManager);

router.get('/aboutus', authController.getAboutUS);

module.exports = router;
