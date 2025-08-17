const mongoose = require('mongoose');
const review = require('./review');

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
    }]
})

const Listning = mongoose.model('Listing',listingSchema)

module.exports = Listning;