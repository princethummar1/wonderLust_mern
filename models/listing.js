const mongoose = require('mongoose');
const Review = require('./review');

const Schema = mongoose.Schema

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        set:(v)=> v===''?'https://images.unsplash.com/photo-1507525428034-b723cf961d3e':v
    },
    price:Number,
    location:String,
    country:String,
    reviews: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
})

listingSchema.post('findOneAndDelete',async(listing)=>{
  if (listing){
  await Review.deleteMany({_id:{$in: listing.reviews}})
  }
})

const Listning = mongoose.model('Listing',listingSchema)

module.exports = Listning;