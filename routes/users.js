const User=require("../models/User");
const express=require("express");
const Post=require("../models/Post");
const Follow=require("../models/Follow");
const db=require("../db");
const moment = require("moment");

router=express.Router();

router.get("/home",async function(req,res){
  const username=req.session.user;
  const email=req.session.email;
  try{
    const follows=await Follow.find({follower:username});
    let posts=[];
    for(var i=0;i<follows.length;i++){
      var post = await Post.find({
    user:follows[i].user,
    updatedAt: {
        $gte: moment().add(-3, "days"),
    }
  }).sort({updatedAt:-1});
    posts.push(...post);
    }
    if(follows.length==0) posts=null;
    res.render("homepage",{
      posts:posts,
      pfname:username,
      pfimgUrl:email,
      username:username,
      imgUrl:email});
  }
  catch(err) {res.status(500).json(err);}

});

router.get("/:username/following",async function(req,res){
  const username=req.params.username;
  try{
    const user=await db.getUser(req.params.username);
    if(!user) res.end("ok");
    else {
       const results=await Follow.find({follower:username});
       const email=req.session.email;
        object={
         pfname:req.session.user,
         pfimgUrl:req.session.email,
         username:user.username,
         imgUrl:user.email,
         follow:results
        }
       if(req.session.user==username) object.d_follow=null;
       else {
         follow=await Follow.findOne({user:username,follower:req.session.user});
         if(!follow) object.d_follow="Follow";
         else object.d_follow="UnFollow";
       }
       res.render("following",object);
    }
  }
  catch(err) {res.status(500).json(err);}
});

router.get("/:username/followers",async function(req,res){
  const username=req.params.username;
  try{
    const user=await db.getUser(req.params.username);
    if(!user) res.end("ok");
    else {
       const results=await Follow.find({user:username});
       const email=req.session.email;
        object={
         pfname:req.session.user,
         pfimgUrl:req.session.email,
         username:user.username,
         imgUrl:user.email,
         follow:results
        }
       if(req.session.user==username) object.d_follow=null;
       else {
         follow=await Follow.findOne({user:username,follower:req.session.user});
         if(!follow) object.d_follow="Follow";
         else object.d_follow="UnFollow";
       }
       res.render("followers",object);
    }
  }
  catch(err) {res.status(500).json(err);}

});

router.get("/:username",async function(req,res){
  const username=req.params.username;
  try{
    const user=await db.getUser(req.params.username);
    if(!user) res.end("ok");
    else {
       const results=await Post.find({user:username});
       const email=req.session.email;
        object={
         pfname:req.session.user,
         pfimgUrl:req.session.email,
         username:user.username,
         imgUrl:user.email,
         posts:results
        }
       if(req.session.user==username) object.d_follow=null;
       else {
         follow=await Follow.findOne({user:username,follower:req.session.user});
         if(!follow) object.d_follow="Follow";
         else object.d_follow="UnFollow";
       }
       res.render("profile",object);
    }
  }
  catch(err) {res.status(500).json(err);}

});


module.exports=router;
