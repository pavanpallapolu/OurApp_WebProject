const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const session=require("express-session");
const dotenv = require('dotenv').config()
const flash=require("connect-flash");
const socket=require("socket.io");
// const passport=require("passport");
// const passportLocalMongoose=require("passport-local-mongoose");
const MongoStore=require("connect-mongo");

const indexRouter=require("./routes/index");
const usersRouter=require("./routes/users");
const postsRouter=require("./routes/posts");
const followsRouter=require("./routes/follows");
const fetchRouter=require("./routes/fetch");

const hour = 3600000;

const app=express();

const uri=`mongodb+srv://admin-pavan:${process.env.DBPASSWORD}@cluster0.zmugtyo.mongodb.net/OurApp`;

async function connectdb(){
  try{
    await mongoose.connect(`mongodb+srv://admin-pavan:${process.env.DBPASSWORD}@cluster0.zmugtyo.mongodb.net/OurApp`);
  }
  catch(err) {console.log(err);}
}

connectdb();


app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(flash());

const sessionMiddleware=session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{maxAge:hour},
  store: new MongoStore({ mongoUrl: uri, })
});

app.use(sessionMiddleware);

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(User.createStrategy());
//
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


app.use("/",indexRouter);

function  auth(req,res,next) {
   if(!req.session.user){
      res.statusCode=401;
      res.redirect("/");
   }
   else next();
}

app.use(auth);

app.use("/",usersRouter);
app.use("/follow",followsRouter);
app.use("/post",postsRouter);
app.use("/f",fetchRouter);

const port=process.env.PORT||3000;

const server=app.listen(port,function(){
  console.log("Server has started Successfully");
});

const io=socket(server);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));

io.use((socket, next) => {
  socket.on("connect",()=>{
     socket.emit("flashmsg","You are already in the chat.");
     return;
  })
  const session = socket.request.session;
  if (session && session.user!=undefined && session.user) {
    next();
  } else {
    socket.emit('redirect', "/");
  }
});

io.on("connection", function (socket) {
  socket.emit("flashmsg","Welcome to the Chat")

  const session = socket.request.session;

  socket.on("chatmsg",msg=>{
    socket.broadcast.emit("msg",{msg:msg,username:session.user});
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
