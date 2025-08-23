const Listning = require("./models/listing");
const Review = require('./models/review');
module.exports.isLogedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl =  req.originalUrl;
        req.flash('error','You Must LogedIn')
        return res.redirect('/login')
    }
    next()
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
        console.log(res.locals.redirectUrl);
    }
    next()
}

module.exports.isOwner =  async(req,res,next)=>{
    let {id} = req.params
    let listing = await Listning.findById(id);
    if(!(listing.owner.equals(res.locals. currentUser._id))){
        req.flash('error','You Dont Have an Permisstion To Do This ')
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.isRevieAuthor = async(req,res,next)=>{
    let {reviewId,id} = req.params;
    let listing = await Listning.findById(id);
    let review   = await Review.findById(reviewId);
    console.log(review.author);
    if(!(review.author.equals(res.locals.currentUser._id))){
        req.flash('error','You Dont Delete Review Thast creaated By Other ')
        return  res.redirect(`/listings/${id}`);
    }
    next();
}