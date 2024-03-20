const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passwordResetController = require('../controllers/passwordResetController');

// Regular authentication routes
router.get('/pstart', authController.getpstart);
router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);
router.get('/campaignmanager', authController.getCampaignManager);
router.get('/aboutus', authController.getAboutUS);

// Password reset routes using router
router.get('/forgot-password', passwordResetController.getForgotPassword);
router.post('/forgot-password', passwordResetController.postForgotPassword);
router.get('/reset-password/:token', passwordResetController.getResetPassword);
router.post('/reset-password/:token', passwordResetController.postResetPassword);

module.exports = router;
