const express = require('express');
const router  = express.Router({mergeParams:true})
const wrapAsync = require('../utils/wrapAsync');
const {reviewSchema} = require('../schema');
const ExpressError  = require('../utils/ExpressError');
const Listing = require('../models/listing');
const Review = require('../models/review');
const { merge } = require('./listings');
const flash = require('connect-flash');
const { isLogedin ,isRevieAuthor} = require('../middleware');


const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>{
            return el.message
        }).join(',')
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}


router.post('/',validateReview,isLogedin,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);


    listing.reviews.push(newReview); 
    newReview.author = req.user._id;
    await newReview.save();
    req.flash('success','Review Added')
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}))

router.delete('/:reviewId',isLogedin,isRevieAuthor,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let {id,reviewId} = req.params
    console.log(id);
    req.flash('success','Review Deleted')
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    let result  = await Review.findByIdAndDelete(reviewId);

    console.log(result)

    res.redirect(`/listings/${listing._id}`);

}))

module.exports = router