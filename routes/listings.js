const express = require('express');
const router  = express.Router()
const wrapAsync = require('../utils/wrapAsync');
const {listingSchema} = require('../schema');
const ExpressError  = require('../utils/ExpressError');
const Listing = require('../models/listing');
const flash = require('connect-flash');
const {isLogedin, isOwner} = require('../middleware');



const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>{
            return el.message
        }).join(',')
        throw new ExpressError(400,errMsg)
    }else{
        next()
    }
}

//INFO:Index Route
router.get("/", wrapAsync( async(req,res)=>{
        let allListings = await Listing.find({})
        // console.log(allListings)
        res.render(`listings/index.ejs`,{allListings})

    })
)
//INFO:Create Route
router.post("/",validateListing,wrapAsync (async(req,res)=>{

    if (!req.body || !req.body.listing)
    throw new ExpressError(400,'Provide Valid data for Listings')
    
    let newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
   await newListing.save()
   req.flash('success','New Listing Created')
   res.redirect('/listings');
    } )
)

 

//INFO:New Route
router.get('/new',isLogedin,(req,res)=>{
    res.render('listings/new.ejs')
})


//INFO:Show Route
router.get('/:id',wrapAsync(async(req,res)=>{
    let {id} =req.params
    const listing = await Listing.findById(id).populate({path:'reviews', populate:{path:'author'}});
    if(!listing){
        req.flash('error','Listing Does Not Exist!')
        return res.redirect('/listings')
        // throw new ExpressError(404,'Id Not Found ')
    }

    res.render('listings/show.ejs',{listing})
}))

//INFO:Edit Route
router.get('/:id/edit',isLogedin,isOwner,wrapAsync(async(req,res)=>{
     let {id} =req.params
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error','Listing Does Not Exist!')
        return res.redirect('/listings')
        // throw new ExpressError(404,'Id Not Found ')
    }
    res.render('listings/edit.ejs', {listing})
}))

//INFO:Update Route
router.put('/:id',isLogedin,validateListing,wrapAsync(async(req,res)=>{
    let {id} =req.params
    let updatedListing = req.body.listing
    const listing = await Listing.findByIdAndUpdate(id,updatedListing)
    res.redirect('/listings')
}))

//INFO:Delete Route
router.delete('/:id',isLogedin,isOwner,wrapAsync(async(req,res)=>{
    let {id} =req.params
    const deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing)
    res.redirect('/listings')
}))


module.exports = router