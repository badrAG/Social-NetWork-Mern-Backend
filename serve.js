const express =require("express");
const mongoose =require("mongoose");
const cors =require("cors");
const badyParser =require("body-parser");
const cookieParser =require("cookie-parser");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const storiesRoutes = require("./routes/stories");

const app = express();

require("dotenv").config();
//middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(badyParser.urlencoded({extended : true}));
app.use(cookieParser());
// app.get('/',(req,res)=>{res.send("hillo")})

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
 });
//server port
const port = process.env.PORT || 8888;

//connect to database
const connectToDatabase = async()=>{
   try{
      await mongoose.connect(process.env.DATABASE_URL,{
         useCreateIndex:true,
         useNewUrlParser:true,
         useUnifiedTopology:true,
         useFindAndModify:false
      });
      console.log("connect to db")
   }catch(err){
      console.log(err)
   }
}

connectToDatabase();

//use routes
app.use("/",userRoutes);
app.use("/",postRoutes);
app.use("/",storiesRoutes);

// Serve static assets if in production


//start port
app.listen(port,(err)=>{
   err ? console.log(err)
   : console.log(`connect port :${port}`);
})