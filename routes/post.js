const express = require('express');
const { getAllPosts,addPost,getPostById,getUserPosts} = require("../controllers/post");
const { requireSignin} = require("../controllers/auth");
const { getUserById} = require("../controllers/user");

const router = express.Router();

router.post("/api/post/create/:userId",requireSignin,addPost);
router.get("/api/posts/:userId",requireSignin,getAllPosts);

router.param("userId",getUserById);

module.exports =router;