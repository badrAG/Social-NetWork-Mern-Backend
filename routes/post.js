const express = require('express');
const {getAllPosts,
    addPost,
    getUserPosts,
    getPostById,
    isOwner,
    deletPost,
    likePost,
    unLikePost,
    addComment,
    deleteComment} = require("../controllers/post");
const { requireSignin} = require("../controllers/auth");
const { getUserById} = require("../controllers/user");

const router = express.Router();
 
router.post("/api/post/create/:userId",requireSignin,addPost);
router.get("/api/posts/:userId",requireSignin,getAllPosts);
router.get("/api/posts/by/:userId",requireSignin,getUserPosts);
router.delete("/api/post/:postId",requireSignin,isOwner,deletPost);
router.put("/api/post/like",requireSignin,likePost);
router.put("/api/post/unlike",requireSignin,unLikePost);
router.put("/api/post/comment",requireSignin,addComment);
router.put("/api/post/unComment",requireSignin,deleteComment);

router.param("userId",getUserById);
router.param("postId",getPostById);

module.exports =router;
