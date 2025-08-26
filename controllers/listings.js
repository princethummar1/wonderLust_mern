const Listing = require('../models/listing');
module.exports.index = async(req,res)=>{
        let allListings = await Listing.find({})
        // console.log(allListings)
        res.render(`listings/index.ejs`,{allListings})

}

module.exports.creatingNewListing = async(req,res)=>{
    let url = req.file.path
    console.log(url);
    if (!req.body || !req.body.listing)
    throw new ExpressError(400,'Provide Valid data for Listings')
    
    let newListing = new Listing(req.body.listing)
    newListing.image = {
        url: req.file.path,
        filename: req.file.filename
    };
    newListing.owner = req.user._id
   await newListing.save()
   req.flash('success','New Listing Created')
   res.redirect('/listings');
    } 

module.exports.renderNewFrom = (req,res)=>{
    res.render('listings/new.ejs')
}

module.exports.showListing = async(req,res)=>{
    let {id} =req.params
    const listing = await Listing.findById(id).populate({path:'reviews', populate:{path:'author'}});
    if(!listing){
        req.flash('error','Listing Does Not Exist!')
        return res.redirect('/listings')
        // throw new ExpressError(404,'Id Not Found ')
    }

    res.render('listings/show.ejs',{listing})
}

module.exports.renderEditFrom = async(req,res)=>{
     let {id} =req.params
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error','Listing Does Not Exist!')
        return res.redirect('/listings')
        // throw new ExpressError(404,'Id Not Found ')
    }
    let blurImage = listing.image.url
    let lowqimage = blurImage.replace('upload/','upload/o_30/')
    res.render('listings/edit.ejs', {listing,lowqimage})
}

module.exports.updatedListing = async(req,res)=>{
    let {id} =req.params
    let updatedListing = req.body.listing

    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url,filename}
    }

    const listing = await Listing.findByIdAndUpdate(id,updatedListing)
    res.redirect('/listings')
}


module.exports.destroyListing = async(req,res)=>{
    let {id} =req.params
    const deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing)
    res.redirect('/listings')
}