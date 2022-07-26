const mongoose=require("mongoose");
const Schema=mongoose.Schema;

followSchema=new Schema({
   user:String,
   follower:String
});

const Follow=mongoose.model("follow",followSchema);

module.exports=Follow;
