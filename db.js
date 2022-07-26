const User=require("./models/User");
const Post=require("./models/Post")

exports.getPost=function(id){
  return Post.findOne({_id:id});
}

exports.getUser=function(username){
   // console.log(username)
    return User.findOne({username:username});
}
