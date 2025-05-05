const User = require("../models/user");

module.exports.renderSignup = (async(req,res)=>{
    try{
        let{email,username,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        //Automatically login after signup start
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Welcome to wanderlust");
            res.redirect("/listings");
        })
        //end
        
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    
});

module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.signupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.loginUser= async(req,res)=>{
    req.flash("success","Welcome back to  wanderlust!");
    let redirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logoutUser= (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logOut!");
        res.redirect("/listings");
    });
}
