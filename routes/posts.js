const Post=require("../models/Post");
const express=require("express");
const mongoose=require("mongoose")
router=express.Router();
const db=require("../db");


router.post("/create",function(req,res){

    const username=req.session.user;
    const email=req.session.email;
    res.render("createpost",{
    pfname:username,
    pfimgUrl:email});
});

router.post("/save",async function(req,res){

  try{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

      const username=req.body.button;
      const title=req.body.postTitle;
      const content=req.body.postBody;
      const email=req.session.email;

      const post=Post({
        postTitle:title,
        postBody:content,
        date:today,
        user:username
      });
      await post.save();
      req.flash("sucmsg","New Post successfully created.")
      res.redirect("/post/"+post._id);
  }
  catch(err) {res.status(500).json(err);}

    // res.render("postpage",{
    //   post:post,
    //   pfname:req.session.user,
    //   pfimgUrl:req.session.email,
    //   username:post.user,
    //   imgUrl:email,
    //   display3:"block"
    // });

});

router.get("/edit:postId",function(req,res){
  const username=req.session.user;
  const email=req.session.email;
  db.getPost(req.params.postId)
  .then((post)=>{
       if(post.user==req.session.user){
         res.render("editpost",{
         pfname:username,
         pfimgUrl:email,
         postId:req.params.postId});
       }
       else{
         res.status(403).json("You don't have access to edit others posts.")
       }
  })
  .catch(err=>res.status(500).json(err));
});

router.post("/edit:postId",async function(req,res){
  try{
    await Post.findByIdAndUpdate(req.params.postId, req.body);
    res.redirect("/post/"+req.params.postId);
  }
  catch(err) {res.status(500).json(err);}
});

router.get("/delete/:postId",function(req,res){
   db.getPost(req.params.postId)
   .then((post)=>{
        if(post.user==req.session.user){
          Post.findByIdAndRemove(req.params.postId)
          .then(()=>res.redirect("/"+req.session.user))
        }
        else{
          res.status(403).json("You don't have access to delete others posts.")
        }
   })
})

router.get("/:postId",function(req,res){

  Post.findOne({_id:req.params.postId},function(err,post){
    if(err) res.status(500).json(err);
    else {
      res.render("postpage",{
        post:post,
        pfname:req.session.user,
        pfimgUrl:req.session.email,
        username:post.user,
        imgUrl:req.session.email,
        sucmsg:req.flash("sucmsg")
      });
    }
  });
});

module.exports=router;
