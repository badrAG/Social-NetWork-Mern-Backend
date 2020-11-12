const User = require("../models/user");
const _ =require("lodash");
const formidable = require("formidable");
const fs = require("fs");

const createUser = (req,res)=>{
    const {name,UserName,email,password}=req.body;
    const user =new User({name,UserName,email,password});
    user.save((err,user)=>{
        err? res.json({error:err}):res.json(user)
    }
    );
}

const getUserById = (req,res,next,id)=>{
 User.findById(id)
 .populate("following","_id name")
 .populate("followers","_id name")
 .exec((err,user)=>{
    err || !user ? res.json({error:err})
    :req.profile = user;
    next();
 });
}

const getUser = (req,res)=>{
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    res.json(req.profile);
}
module.exports = {
    createUser,
    getUserById,
    getUser
}