const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const { route } = require('./listings');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const { signupUser, renderLoginForm, loginUser, logoutUser, renderSignUpForm } = require('../controllers/user');

router.get('/signup',renderSignUpForm)

router.post('/signup', wrapAsync(signupUser));


router.get('/login',renderLoginForm)


router.post('/login',saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),wrapAsync(loginUser))

router.get('/logout', logoutUser)

module.exports = router