
const listing=require("../models/Listing.js")

module.exports.index=(async(req,res)=>{
    let allListings=await  listing.find({});
    res.render('listings/index',{allListings});
  
  })

module.exports.createListing=( async (req, res,next) => {
  // console.log(req.body);  // This will log the entire body of the request
      
      // Destructure the data
      const { title, description, price, country, location } = req.body.listing;
      
      
      // Create a new Listing instance
      const newListing = new listing ({
          title,
          description,
          price,
          location,
          country,
          image: {
              filename: "listingimage",  // Default value
              url: "https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=",
          }
      });

      let url = req.file.path
      let filename = req.file.filename;
      newListing.owner=req.user._id; // Assign the logged-in user's ID to the owner field
      // Save the new listing
      newListing.image={url,filename};
      await newListing.save();
      req.flash("success","New listing Created Successfully");

      // Redirect or render the saved listing
      res.redirect("/listings");
  
}) ;

module.exports.showListing=(async (req,res)=>{
  let {id}=req.params;
  let data= await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  // console.log(data); // Log the listing to make sure it contains data
  if(!data){
     req.flash("error","listings you looking for does not Exist!")
     res.redirect("/listings");
  }
  console.log(data);
  res.render('listings/show', { listing: data });

//    res.send("welcome");
})

module.exports.editListing=(async(req,res)=>{
  let {id}=req.params;
  let data= await listing.findById(id);
  let originalImageUrl = data.image.url; // Store the original image URL
  originalImageUrl=originalImageUrl.replace("/upload","/upload/w_200,h_120,c_fill"); 
  res.render('listings/edit',{listing:data,originalImageUrl}); // Pass the original image URL to the template
})

module.exports.updateListing=(async(req,res)=>{
    let {id}=req.params;
    let Listing=await listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!== "undefined"){
    let url = req.file.path
    let filename = req.file.filename;
    Listing.image={url,filename};
    await Listing.save();
    }
    req.flash("success","updated successfully");
    res.redirect(`/listings/${id}`);
    
})

module.exports.destroyListing=(async(req,res)=>{
  let{id}=req.params;
  let deletedList=await listing.findByIdAndDelete(id);
  console.log(deletedList);
  req.flash("success","Data Deleted");
  res.redirect("/listings");

})


