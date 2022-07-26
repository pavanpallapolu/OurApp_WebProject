const Follow=require("../models/Follow");
const express=require("express");
const router=express.Router();

router.get("/:username",async (req,res)=>{
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
       else await Follow.remove(result);
       res.redirect("/"+user);
     }
     catch(err) {res.status(500).json(err);}
   }
});

module.exports=router;
