const mongoose = require('mongoose');
const express = require('express');
// const Listing = require('./models/listing');
const methodOverride = require('method-override');
const path = require('path');
const ejsMate = require('ejs-mate');
const app = express();
// const wrapAsync = require('./utils/wrapAsync');
const ExpressError  = require('./utils/ExpressError');
// const {listingSchema} = require('./schema');
// const {reviewSchema} = require('./schema');
// const Listning = require('./models/listing');
// const Review = require('./models/review');
const  session = require('express-session')
const flash = require('connect-flash');

const listings = require('./routes/listings.js');
const reviews = require('./routes/review.js')

// const review = require('./models/review');

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


const sessionOption ={
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now + 7*24*60*60*1000,
    maxAge:7*24*60*60*100,
    httpOnly:true,
  }
}


app.get('/',(req,res)=>{
    res.send('This is Root ')
})



app.use(session(sessionOption))
app.use(flash())

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next()
})



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




app.use('/listings',listings)

//NOTE:Reviews
app.use('/listings/:id/review',reviews)





// app.all('*',(req,res,next)=>{
//     next(new ExpressError(404,'Page Not Found'))
// })



app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { err });
});



app.listen(8080,()=>{
    console.log('Listning on Port 8080');
})

