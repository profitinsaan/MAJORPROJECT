const express= require("express")
const router= express.Router({mergeParams:true});
const Review= require("../models/review")
const wrapAsync=require("../utils/wrapAsync")
const ExpressError=require("../utils/ExpressError")
const{isLoggedIn}=require("../middleware");
const listing = require("../models/Listing");
const {validateReview,isReviewowner } = require("../middleware");
const Reviewcontroller=require("../Controllers/review.js");

//Review
//post  review request route

router.post("/",isLoggedIn,validateReview,wrapAsync(Reviewcontroller.createReview)
);
   
   // Delate review route
   router.delete("/:reviewId",isLoggedIn,isReviewowner,wrapAsync(Reviewcontroller.desdroyReview)
);

   module.exports=router;