const express = require('express');
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync');
const { listingSchema } = require('../schema');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const flash = require('connect-flash');
const { isLogedin, isOwner } = require('../middleware');
const listingsController = require('../controllers/listings');

const multer = require('multer');
const {storage} = require('../cloudConfig');
const upload = multer({storage})



const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => {
            return el.message
        }).join(',')
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}


router.route("/")
        //INFO:Index Route
        .get(wrapAsync(listingsController.index))
        //INFO:Create Route
        //validateListing ADD AFTER SOME TIME
        .post(upload.array('listing[image]',5), wrapAsync(listingsController.creatingNewListing))



//INFO:New Route
router.get('/new', isLogedin, listingsController.renderNewFrom)


router.route('/:id')
        //INFO:Show Route
        .get( wrapAsync(listingsController.showListing))
        //INFO:Update Route
        //validating left
        .put(isLogedin, upload.array('listing[image]',5), wrapAsync(listingsController.updateListing))  
        //INFO:Delete Route      
        .delete(isLogedin, isOwner, wrapAsync(listingsController.destroyListing))
        

//INFO:Edit Route
router.get('/:id/edit', isLogedin, isOwner, wrapAsync(listingsController.renderEditFrom))





module.exports = router