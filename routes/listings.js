const express= require("express")
const router= express.Router()
const wrapAsync=require("../utils/wrapAsync");
const{isLoggedIn,isowner,validateListing}=require("../middleware.js");
const listingcontroller=require("../Controllers/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})



  
// listing new route

router.get("/new",isLoggedIn, (req, res) => {
    
    res.render('listings/new.ejs');  // Render the 'new.ejs' view
    // res.send("hello");
});

router
.route("/")
      //create new add listing
    .post(isLoggedIn,upload.single('listing[image][url]'),validateListing,wrapAsync(listingcontroller.createListing))
    // listing route where all data shows
    .get(wrapAsync(listingcontroller.index));

//show route

router
.route("/:id")
// show listing route
.get(wrapAsync(listingcontroller.showListing))
//update listing route
.put(isLoggedIn,isowner,upload.single('listing[image][url]'),validateListing,wrapAsync(listingcontroller.updateListing))
//delete listing route
.delete(isLoggedIn,isowner,wrapAsync(listingcontroller.destroyListing));

// edit route
router.get("/:id/edit",isLoggedIn,isowner,wrapAsync(listingcontroller.editListing)
);

 module.exports= router;