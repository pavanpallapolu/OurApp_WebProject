const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const postSchema=new Schema({
  postTitle:String,
  postBody:String,
  date: String,
  user:String
},{timestamps:true});

postSchema.index({postTitle:"text"});

const Post=mongoose.model("post",postSchema);

module.exports=Post;
