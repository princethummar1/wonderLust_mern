const Listing = require('../models/listing');
const Review  = require('../models/review');

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);


    listing.reviews.push(newReview); 
    newReview.author = req.user._id;
    await newReview.save();
    req.flash('success','Review Added')
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}
module.exports.destroyReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let {id,reviewId} = req.params
    console.log(id);
    req.flash('success','Review Deleted')
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    let result  = await Review.findByIdAndDelete(reviewId);

    console.log(result)

    res.redirect(`/listings/${listing._id}`);

}