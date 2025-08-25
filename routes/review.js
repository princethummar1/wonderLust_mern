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
const { createReview,destroyReview } = require('../controllers/review');


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


router.post('/',validateReview,isLogedin,wrapAsync(createReview))

router.delete('/:reviewId',isLogedin,isRevieAuthor,wrapAsync(destroyReview))

module.exports = router