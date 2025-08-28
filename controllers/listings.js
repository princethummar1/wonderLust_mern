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
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }


  if (req.files && req.files.length > 0) {
    let newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    listing.image.push(...newImages);
  }
  if (req.body.deleteImages && req.body.deleteImages.length > 0) {
    // Filter the listing's images to remove the selected ones
    listing.image = listing.image.filter(
      img => !req.body.deleteImages.includes(img.filename)
    );
    // You would also add your Cloudinary deletion logic here
  }
  const oldUsage = listing.usage;
  const newUsage = req.body.listing.usage;
  if (oldUsage !== newUsage) {
    // If the usage type has changed, unset the data for the old type.
    if (oldUsage === 'Residential') listing.residential = undefined;
    if (oldUsage === 'Commercial') listing.commercial = undefined;
    if (oldUsage === 'Hospitality') listing.hospitality = undefined;
    if (oldUsage === 'Land/Other') listing.land = undefined;
  }
  Object.assign(listing, req.body.listing);
  // 5. Save all the changes to the database in one go
  await listing.save();

  req.flash('success', 'Listing Updated Successfully!');
  res.redirect(`/listings/${listing._id}`);
};



module.exports.destroyListing = async (req, res) => {
  let { id } = req.params
  const deleteListing = await Listing.findByIdAndDelete(id);
  res.redirect('/listings')
}

module.exports.filterListings = async (req, res) => {
  const { minPrice, maxPrice, propertyType, amenities } = req.query;
  let filter = {};
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  if (propertyType && propertyType.length > 0) {
    filter.propertyType = { $in: propertyType };
  }

  if (amenities && amenities.length > 0) {
    filter.$or = [
      { 'residential.amenities': { $in: amenities } },
      { 'commercial.amenities': { $in: amenities } },
      { 'hospitality.amenities': { $in: amenities } }
    ];
  }


  const allListings = await Listing.find(filter).populate('owner');

  res.render('listings/index.ejs', { allListings });
}


// In controllers/listings.js

module.exports.showCategory = async (req, res) => {
  const { category } = req.params;

  // Start with an empty filter object
  let filter = {};

  // Build the filter based on the category clicked
  switch (category) {
    case 'Apartment':
    case 'Villa':
    case 'Hotel':
    case 'Office':
      filter.propertyType = category;

      break;

    case 'Amazing Pools':
      filter.$or = [
        { 'residential.amenities': 'Pool' },
        { 'hospitality.amenities': 'Pool' }
      ];
      break;

    case 'Countryside':
      filter.location = { $in: ['Manali', 'Lonavala', 'Aspen', 'Cotswolds', 'Scottish Highlands'] };
      break;

    case 'Beachfront':
      filter.location = { $in: ['Malibu', 'Goa', 'Cancun', 'Bali', 'Mykonos'] };
      break;

    case 'Trending':
      // A real "trending" might use review counts or average ratings
      filter.price = { $gte: 4000 };
      break;

    default:
      filter.propertyType = 'UnknownCategory';
      break;
  }

  const allListings = await Listing.find(filter).populate('owner');


  res.render('listings/index.ejs', { allListings });
};


module.exports.searchFn = async (req, res) => {
  const { q } = req.query; 

  if (!q) {
    return res.redirect("/listings");
  }

  try {
    const searchRegex = new RegExp(q, 'i'); 
    const allListings = await Listing.find({
      $or: [
        { title: { $regex: searchRegex } },
        { location: { $regex: searchRegex } },
        { country: { $regex: searchRegex } }
      ]
    });

    if (allListings.length > 0) {
      res.render("listings/index.ejs", { allListings });
    } else {
      req.flash("error", "No listings found for your search query.");
      res.redirect("/listings");
    }

  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while searching.");
    res.redirect("/listings");
  }
}