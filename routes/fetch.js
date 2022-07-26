const Follow=require("../models/Follow");
const User=require("../models/User");
const Post=require("../models/Post");
const express=require("express");
const router=express.Router();


router.get("/follow/:username",async (req,res)=>{
   const current_user=req.session.user;
   const user=req.params.username;
   if(user==current_user) res.status(403).json("You cannot follow yourself.");
   else{
     try {
       const result=await Follow.findOne({user:user,follower:current_user});
       if(!result){
          const follow=Follow({
            user:user,
            follower:current_user
          });
          await follow.save();
       }
       else await Follow.deleteOne(result);
       res.status(200).json("followed/unfollowed successfully");
     }
     catch(err) {res.status(500).json(err);}
   }
});

router.get("/post/:postId",async (req,res)=>{
  try{
    const post=await Post.findById(req.params.postId);
    res.status(200).json(post);
  }
  catch(err) {res.status(500).json(err);}
});

router.post("/search",async (req,res)=>{
  try{
    const results={};
    results.posts=await Post
     .find(
         { $text : { $search : req.body.input } },
         { score : { $meta: "textScore" } }
     )
     .sort({ score : { $meta : 'textScore' } });

     results.users=await User
     .find(
         { $text : { $search : req.body.input } },
         { score : { $meta: "textScore" } }
     )
     .sort({ score : { $meta : 'textScore' } });

     res.status(200).json(results);
  }
  catch(err) {res.status(500).json(err);}
});

module.exports=router;
