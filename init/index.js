const mongoose = require('mongoose');
const initData = require(`./data`)
const Listing = require('../models/listing');


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

main().then(()=>{
    console.log("DB is Connected Suscssfully");
}).catch((Err)=>{
    console.log(Err);
})

async function main(){
 await mongoose.connect(MONGO_URL)
}

const initDB = async()=>{
    await Listing.deleteMany({})
    Listing.insertMany(initData.data);
    console.log(`Data is Intilized`)
}

initDB()