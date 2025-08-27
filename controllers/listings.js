const Listing = require('../models/listing');
module.exports.index = async (req, res) => {
    let allListings = await Listing.find({}).populate('owner')
    // console.log(allListings)
    res.render(`listings/index.ejs`, { allListings })

}

module.exports.creatingNewListing = async (req, res) => {
    try {
    if (!req.body || !req.body.listing)
        throw new ExpressError(400, 'Provide Valid data for Listings')

    let newListing = new Listing(req.body.listing)

    newListing.image = req.files.map(f => (
        {
            url: f.path,
            filename: f.filename
        })
    );
    newListing.owner = req.user._id
    await newListing.save()
    req.flash('success', 'New Listing Created')
    res.redirect('/listings');
    } catch (e) {
    // Pass any errors to the error handling middleware
    next(e);
  }
}



module.exports.renderNewFrom = (req, res) => {
    res.render('listings/new.ejs')
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
    if (!listing) {
        req.flash('error', 'Listing Does Not Exist!')
        return res.redirect('/listings')
        // throw new ExpressError(404,'Id Not Found ')
    }

    res.render('listings/show.ejs', { listing })
}

module.exports.renderEditFrom = async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing Does Not Exist!')
        return res.redirect('/listings')
        // throw new ExpressError(404,'Id Not Found ')
    }
    let lowqimage = ""; 
    if (listing.image && listing.image.length > 0) {
        // CORRECT: Get the URL from the first image in the array
        let originalUrl = listing.image[0].url; 
        lowqimage = originalUrl.replace('/upload', '/upload/e_blur:1000,q_auto,f_auto');
    }
    res.render('listings/edit.ejs', { listing, lowqimage })
}






// module.exports.updatedListing = async (req, res) => {
//     let { id } = req.params
//     let updatedListing = req.body.listing

//     if (req.file) {
//         let url = req.file.path;
//         let filename = req.file.filename;
//         updatedListing.image = { url, filename }
//     }

//     const listing = await Listing.findByIdAndUpdate(id, updatedListing)
//     res.redirect('/listings')
// }


// In your controllers/listings.js file

// In your controllers/listings.js file

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  // 1. Find the listing by its ID
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }

  // 2. Update the text fields from the form
  // Use Object.assign to merge the new data onto the found listing
  Object.assign(listing, req.body.listing);

  // 3. Check for and add any newly uploaded images
  if (req.files && req.files.length > 0) {
    let newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    listing.image.push(...newImages);
  }

  // 4. Check for and delete any images marked for removal
  if (req.body.deleteImages && req.body.deleteImages.length > 0) {
    // Filter the listing's images to remove the selected ones
    listing.image = listing.image.filter(
      img => !req.body.deleteImages.includes(img.filename)
    );
    // You would also add your Cloudinary deletion logic here
  }

  // 5. Save all the changes to the database in one go
  await listing.save();

  req.flash('success', 'Listing Updated Successfully!');
  res.redirect(`/listings/${listing._id}`);
};



module.exports.destroyListing = async (req, res) => {
    let { id } = req.params
    const deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing)
    res.redirect('/listings')
}