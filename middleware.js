const listing = require("./models/Listing");
const { listingSchema, reviewSchema } =require("./schema");
const Review = require("./models/review");

const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must login to create listing");
         return res.redirect("/login");
        
    }
    next();
}

 // redirect to saveUrl
module.exports.saveRedirectUrl=(req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
       }
       next();
};

module.exports.isowner=async(req,res,next)=>{
    let{id}=req.params;
    let listingItem= await listing.findById(id);
    
    if (!listingItem.owner.equals(req.user._id)) {
        req.flash("error", "You are not authorized to do this action!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
// validate listing
module.exports. validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(e => e.message).join(', ');
        return next(new ExpressError(400, errMsg)); // Pass the error to the error handler
    }
    next();
};
// validate Review
module.exports. validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(e => e.message).join(', ');
        return next(new ExpressError(400, errMsg));
    }
    next();
};

//validate reviewowner
module.exports.isReviewowner = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review || !review.author || !review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
