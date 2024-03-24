const express = require('express');
const router = express.Router();

const { signup, login, sendotp, changePassword } = require('../controllers/Auth');
const { resetPasswordToken, resetPassword } = require('../controllers/ResetPassword');
const { auth } = require('../middlewares/auth');

router.post('/login', login);
router.post('/signup', signup);
router.post('/sendotp', sendotp);
router.get('/sendotp', (req, res) => {
    res.send('otp sent')
});

router.post('/changepassword', auth, changePassword);

router.post('/reset-password-token', resetPasswordToken);
router.post('/reset-password', resetPassword);

module.exports = router;


