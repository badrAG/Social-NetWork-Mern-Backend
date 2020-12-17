const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const PostSchema = new mongoose.Schema({
    text:{
        type:String,
        trim:true,
    },
    image:{
        type:String,
        trim:true,
    },
    video:{
        type:String,
        trim:true,
    },
    PostedBy:{
        type:ObjectId,
        ref:"User",
    },
    likes:[{type:ObjectId,ref:"User"}],
    comments:[
        {
        text:String,
        created:{type:Date,default:Date.now},
        commentedBy:{
            type:ObjectId,
            ref:"User",
        }
    }
]
},
  {
    timestamps:true
  }
)

module.exports = mongoose.model("Post",PostSchema);
