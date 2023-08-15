const { signupController, loginController, refreshAccessTokenController, logoutController } = require('../Controllers/authController');
const router = require('express').Router();


router.post('/signup',signupController);
router.post('/login',loginController);
router.get('/refresh',refreshAccessTokenController);
router.post('/logout',logoutController);


module.exports = router;