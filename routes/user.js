const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const { route } = require('./listings');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
router.get('/signup', (req, res) => {
    res.render('users/signup.ejs')
})

router.post('/signup', wrapAsync(async (req, res,next) => {
    try {
        let { username, email, password } = req.body
        let newUser = new User({ email, username });
        let registedUser = await User.register(newUser, password);
        console.log(registedUser);
        req.login(registedUser,(err)=>{
            if(err){
                next(err)
            }
        req.flash('success', 'Welcome To  WunderLust');
        res.redirect('/listings');
        })
        
    } catch (error) {
        req.flash('error',error.message)
        res.redirect('/signup')
    }

}));


router.get('/login',(req,res)=>{
    res.render('users/login.ejs')
})

router.post('/login',saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),wrapAsync(async(req,res)=>{
    req.flash('success','Welcome Back To  WaunderLust');
    let redirectUrl = res.locals.redirectUrl || '/listings' 
    
    res.redirect(redirectUrl)

}))

router.get('/logout',(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash('success','LogedOut SuccessFully');
        res.redirect('/listings')
    })
})

module.exports = router