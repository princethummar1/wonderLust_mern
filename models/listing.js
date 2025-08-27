const mongoose = require('mongoose');
const Review = require('./review');

const Schema = mongoose.Schema

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:[{
        url:String,
        filename:String
    }],
    price:Number,
    location:String,
    country:String,

    purpose: {
    type: String,
    enum: ["Sell", "Rent"],
    required: true
  },
    usage: {
    type: String,
    enum: ["Residential", "Commercial", "Hospitality", "Land/Other"],
    required: true
  },
   propertyType: {
    type: String,
    enum: [
      // Residential
      "Apartment", "Villa", "Studio", "Independent House", "Plot",

      // Commercial
      "Office", "Shop", "Showroom", "Warehouse", "Industrial Unit",

      // Hospitality
      "Hotel", "Resort", "Guest House", "Hostel", "Service Apartment",

      // Land / Other
      "Agricultural Land", "Co-working", "Storage Unit", "Special Purpose"
    ],
    required: true
  },residential: {
    size: Number, // in sqft
    furnishing: { type: String, enum: ["Furnished", "Semi-Furnished", "Unfurnished"] },
    amenities: [String] // e.g. ["Pool", "Gym", "Parking"]  
  },
  commercial: {
    size: Number, // in sqft
    parkingSpaces: Number,
    amenities: [String]
  },
  hospitality: {
    rooms: Number,       
    starRating: Number,  
    amenities: [String] 
  },
  land: {
    plotSize: Number,    // in sqft or acres
    plotUnit: { type: String, enum: ["sqft", "sqyd", "acre", "hectare"] }
  },


    reviews: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    
})

listingSchema.post('findOneAndDelete',async(listing)=>{
  if (listing){
  await Review.deleteMany({_id:{$in: listing.reviews}})
  }
})

const Listning = mongoose.model('Listing',listingSchema)

module.exports = Listning;