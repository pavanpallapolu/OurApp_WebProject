const express=require("express");
const bcrypt=require("bcrypt");
const saltRounds=10;
const User=require("../models/User");
const md5=require("md5");
const db=require("../db");

router=express.Router();

router.get("/",function(req,res){
  if(req.session.user) res.redirect("/home");
  else {
    res.render("loginpage",{errmsg:req.flash("errmsg")});
  }
});

router.post("/signup",function(req,res){
   const username=req.body.username;
   const email=req.body.email;
   const password=req.body.password;

   const user=db.getUser(username)
   .then((user)=>{
     if(user) {
       // console.log("Username already exists");
       // res.render("loginpage",{display:"none",display2:"block"});
       req.flash("errmsg","Username already exists");
       res.redirect("/");
     }
     else {
       bcrypt.hash(password,saltRounds,async function(err,hash){
         if(err) res.status(500).json(err);
         else{
           const user1=User({
             username:username,
             email:md5(email),
             password:hash
           });
           try{
             await user1.save();
             req.session.user=username;
             req.session.email=email;
             res.redirect("/home");
           }
           catch(err) {res.status(500).json(err)};
         }
       });
   }
  })
  .catch((err)=>res.status(500).json(err));
});

router.post("/login",function(req,res){
   const username=req.body.username;
   const password=req.body.password;

   db.getUser(username)
   .then((foundUser)=>{
     if(foundUser){
       bcrypt.compare(password, foundUser.password,(err,result)=>{
          if(err) res.status(500).json(err);
          else if(result===true)
          {
            req.session.user=username;
            req.session.email=foundUser.email;
            res.redirect("/home");
          }
          else  {
            res.statusCode=400;
            req.flash("errmsg","invalid Username/password");
            res.redirect("/");
          }

       });
     }
     else{
       // console.log("User not Found");
       res.statusCode=404;
       // res.status(404).json("Notfound");
       req.flash("errmsg","invalid Username/password");
       res.redirect("/");
     }
   })
   .catch((err)=>res.status(500).json(err));

});

router.get("/logout",function(req,res){
    if(req.session.user){
      req.session.destroy();
      res.clearCookie("connect.sid");
      res.redirect("/");
    }
    else res.redirect("/");
});


module.exports=router;
