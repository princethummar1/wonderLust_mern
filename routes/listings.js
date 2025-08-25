const express = require('express');
const router  = express.Router()
const wrapAsync = require('../utils/wrapAsync');
const {listingSchema} = require('../schema');
const ExpressError  = require('../utils/ExpressError');
const Listing = require('../models/listing');
const flash = require('connect-flash');
const {isLogedin, isOwner} = require('../middleware');
const listingsController = require('../controllers/listings');

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
router.get("/", wrapAsync(listingsController.index))



//INFO:Create Route
router.post("/",validateListing,wrapAsync (listingsController.creatingNewListing)
)

 

//INFO:New Route
router.get('/new',isLogedin,listingsController.renderNewFrom)


//INFO:Show Route
router.get('/:id',wrapAsync(listingsController.showListing))

//INFO:Edit Route
router.get('/:id/edit',isLogedin,isOwner,wrapAsync(listingsController.renderEditFrom))


//INFO:Update Route
router.put('/:id',isLogedin,validateListing,wrapAsync(listingsController.updatedListing))


//INFO:Delete Route
router.delete('/:id',isLogedin,isOwner,wrapAsync(listingsController.destroyListing))


module.exports = router