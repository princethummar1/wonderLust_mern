const User = require('../models/user')
module.exports.renderSignUpForm =  (req, res) => {
    res.render('users/signup.ejs')
};
module.exports.signupUser = async (req, res,next) => {
    try {
        let { username, email, password } = req.body
        let newUser = new User({ email, username });
        let registedUser = await User.register(newUser, password);
        console.log(registedUser);
        req.login(registedUser,(err)=>{
            console.log(err);
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

}

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login.ejs')
}

module.exports.loginUser = async(req,res)=>{
    req.flash('success','Welcome Back To  WaunderLust');
    let redirectUrl = res.locals.redirectUrl || '/listings' 
    
    res.redirect(redirectUrl)

}

module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash('success','LogedOut SuccessFully');
        res.redirect('/listings')
    })
}