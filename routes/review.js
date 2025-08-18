const express = require('express');
const router  = express.Router({mergeParams:true})
const wrapAsync = require('../utils/wrapAsync');
const {reviewSchema} = require('../schema');
const ExpressError  = require('../utils/ExpressError');
const Listing = require('../models/listing');
const Review = require('../models/review');
const { merge } = require('./listings');



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


router.post('/',validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    console.log(listing)

    listing.reviews.push(newReview); 

    await newReview.save();
    await listing.save();
    console.log(listing.reviews[0])
    res.redirect(`/listings/${listing._id}`);
}))

router.delete('/:reviewId',wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let {id,reviewId} = req.params
    console.log(id);

    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    let result  = await Review.findByIdAndDelete(reviewId);

    console.log(result)

    res.redirect(`/listings/${listing._id}`);

}))

module.exports = router