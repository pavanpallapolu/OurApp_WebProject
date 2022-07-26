const mongoose=require("mongoose");
const Schema=mongoose.Schema;


const userSchema=new Schema({
  username:{
    type:String,
    required:true,
    unique:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  }
});

userSchema.index({username:"text"});

// userSchema.plugin(passportLocalMongoose);

const User=mongoose.model("user",userSchema);

module.exports=User;
