const express= require("express");
const wrapAsync = require("../utils/wrapAsync");
const router= express.Router();
const User=require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController= require("../Controllers/users")

// signup form
router.get("/signup",(userController.signupForm));
//signup route
router.post("/signup",wrapAsync(userController.renderSignup))

// login form
router.get("/login",(userController.loginForm));
// login user
router.post("/login",
    saveRedirectUrl,
    passport.authenticate('local',
    {failureRedirect:'/login',failureFlash:true}),
    userController.loginUser
)
// logout user
router.get("/logout",(userController.logoutUser)
);

module.exports= router;