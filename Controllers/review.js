
const listing=require("../models/Listing.js");
const Review= require("../models/review.js")
module.exports.createReview=(async(req,res)=>{
    let listingData = await listing.findById(req.params.id)
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id; // Assign the logged-in user's ID to the author field
    console.log("New Review:", newReview);
    listingData.reviews.push(newReview);
    await newReview.save();
    await listingData.save();
   
    console.log("Review saved");
    res.redirect(`/listings/${listingData._id}`);
   })

   module.exports.desdroyReview=(async(req,res)=>{
    let{ id, reviewId}= req.params;
    await listing.findByIdAndUpdate(id, {$pull:{ reviews :reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);

    console.log("Review ID:", reviewId);
})