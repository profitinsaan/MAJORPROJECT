require('dotenv').config()
console.log(process.env.SECRET)
const express= require("express");
const app=express();
const mongoose=require("mongoose");
const path=require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const ExpressError=require("./utils/ExpressError");
const listings = require("./routes/listings.js");
const reviews= require("./routes/reviews.js")
const userRouter= require("./routes/user.js")
const flash=require("connect-flash")
const session= require("express-session")
const MongoStore = require('connect-mongo');

const passport= require("passport")
const LocalStrategy=require("passport-local")
const User= require("./models/user.js")
// const MONGO_URL = process.env.ATLASDB_URL ;
const dbUrl = process.env.ATLASDB_URL ;
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname,"/public")));

//connect_mongostore
const store = MongoStore.create({
    mongoUrl: dbUrl, 
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60, // time period in seconds
})
store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

//session express
app.use(session({
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
       expires:Date.now()+7 * 24 * 60 * 60 * 1000,
       maxAge:7 * 24 * 60 * 60 * 1000,
       httpOnly:true,
    },
}));



// flash
app.use(flash());

app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

//serializeUser() Generates a function that is used by Passport to serialize users into the session
//deserializeUser() Generates a function that is used by Passport to deserialize users into the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});



// router object
app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);

app.use("/",userRouter);

main().then(()=>{
    console.log("mongodb connected")
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(dbUrl);
}


// for undefined router custom error handle
app.all("*",(req,res,next)=>{
    next( new ExpressError(404,"Page not found!"));
})

app.use((err, req, res, next) => {
    console.error(err); // Log the error
    const { status = 500, message = "Something went wrong!" } = err;

    res.status(status).render("error.ejs", { message });
});


app.listen("8000",()=>{
    console.log(`port are listening at 8000 port`);
})