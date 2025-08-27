// In init/index.js

const mongoose = require("mongoose");
const { data, userIds, reviewComments } = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// Make sure your .env file has the correct database URL
// For example: MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

async function main() {
  // Establish database connection
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connected to DB");
    initDB(); // Call initDB only after a successful connection
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  // Clear existing data
  await Listing.deleteMany({});
  await Review.deleteMany({});

  // Loop through the sample data to create listings and reviews
  for (let listingData of data) {
    // 1. Assign a random owner to the listing
    const ownerId = userIds[Math.floor(Math.random() * userIds.length)];
    const newListing = new Listing({ ...listingData, owner: ownerId });

    // 2. Create and add random reviews for this listing
    const reviewCount = Math.floor(Math.random() * 3); // 0-2 reviews
    const reviewerIds = userIds.filter(id => id !== ownerId); // Others will review

    if (reviewerIds.length > 0) {
      for (let i = 0; i < reviewCount; i++) {
        // Create a new Review document
        const newReview = new Review({
          comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
          rating: Math.floor(Math.random() * 2) + 4, // Rating between 4-5
          author: reviewerIds[i % reviewerIds.length]
        });
        
        // Save the review to the Review collection
        await newReview.save();
        
        // Push the new review's ID into the listing's reviews array
        newListing.reviews.push(newReview._id);
      }
    }
    
    // 3. Save the listing (with owner and review IDs)
    await newListing.save();
  }

  console.log("Data was successfully initialized!");
};