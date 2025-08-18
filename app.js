const mongoose = require('mongoose');
const express = require('express');
const Listing = require('./models/listing');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const app = express();
const wrapAsync = require('./utils/wrapAsync');
const ExpressError  = require('./utils/ExpressError');
const {listingSchema} = require('./schema');
const {reviewSchema} = require('./schema');
const Listning = require('./models/listing');
const Review = require('./models/review');
const review = require('./models/review');

app.use(express.json());

app.set(`view engine`,`ejs`)
app.set(`views`,path.join(__dirname,`views`))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.engine('ejs', ejsMate);  

  


app.use(express.static(path.join(__dirname,`public`)))

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

main().then(()=>{
    console.log("DB is Connected Suscssfully");
}).catch((Err)=>{
    console.log(Err);
})

async function main(){
 await mongoose.connect(MONGO_URL)
}

app.get('/',(req,res)=>{
    res.send('This is Root ')
})


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


// app.get('/testlisting',(req,res)=>{
//     let sampleListing = Listing({
//          title: "Modern Apartment in City Center",
//   description: "A stylish apartment located in the heart of the city, close to restaurants and shops.",
//   image: "https://images.unsplash.com/photo-1560448071-3b4b41a7b7d6",
//   price: 95,
//   location: "Bangalore",
//   country: "India"
//     });
//     sampleListing.save()
//     res.send(`testapi`)
// })



//INFO:Index Route
app.get("/listings", wrapAsync( async(req,res)=>{
        let allListings = await Listing.find({})
        // console.log(allListings)
        res.render(`listings/index.ejs`,{allListings})

    })
)
//INFO:Create Route
app.post("/listings",validateListing,wrapAsync (async(req,res)=>{

    if (!req.body || !req.body.listing)
    throw new ExpressError(400,'Provide Valid data for Listings')
    
        let newListing = new Listing(req.body.listing)
   await newListing.save()
   res.redirect('/listings');
    } )
)

 

//INFO:New Route
app.get('/listings/new',(req,res)=>{
    res.render('listings/new.ejs')
})


//INFO:Show Route
app.get('/listings/:id',wrapAsync(async(req,res)=>{
    let {id} =req.params
    const listing = await Listing.findById(id).populate('reviews');
    if(!listing){
        throw new ExpressError(404,'Id Not Found ')
    }

    res.render('listings/show.ejs',{listing})
}))

//INFO:Edit Route
app.get('/listings/:id/edit',wrapAsync(async(req,res)=>{
     let {id} =req.params
    const listing = await Listing.findById(id);

    res.render('listings/edit.ejs', {listing})
}))

//INFO:Update Route
app.put('/listings/:id',validateListing,wrapAsync(async(req,res)=>{
    let {id} =req.params
    let updatedListing = req.body.listing
    const listing = await Listing.findByIdAndUpdate(id,updatedListing)
    res.redirect('/listings')
}))

//INFO:Delete Route
app.delete('/listings/:id',wrapAsync(async(req,res)=>{
    let {id} =req.params
    const deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing)
    res.redirect('/listings')
}))


//NOTE:Reviews
app.post('/listings/:id/review',validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listning.findById(req.params.id);
    let newReview = new Review(req.body.review);

    console.log(listing)

    listing.reviews.push(newReview); 

    await newReview.save();
    await listing.save();
    console.log(listing.reviews[0])
    res.redirect(`/listings/${listing._id}`);
}))

app.delete('/listings/:id/review/:reviewId',wrapAsync(async(req,res)=>{
    let listing = await Listning.findById(req.params.id);
    let {id,reviewId} = req.params
    console.log(id);

    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    let result  = await Review.findByIdAndDelete(reviewId);

    console.log(result)

    res.redirect(`/listings/${listing._id}`);

}))


app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { err });
});



app.listen(8080,()=>{
    console.log('Listning on Port 8080');
})

