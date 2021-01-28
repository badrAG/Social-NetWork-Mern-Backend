const express = require('express');
const multer = require('multer');
const path = require('path');
const {getAllPosts,
    addPost,
    getUserPosts,
    getPostById,
    isOwner,
    deletPost,
    likePost,
    unLikePost,
    addComment,
    deleteComment,
    getImagePosts,
    getVideoPosts
    } = require("../controllers/post");
const { requireSignin} = require("../controllers/auth");
const { getUserById} = require("../controllers/user");

const router = express.Router();
const storage = multer.diskStorage({
    destination: './Upload/PostPicture',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${req.profile._id}${path.extname(file.originalname)}`)
    }
})
const upload = multer({
    storage:storage
})
router.post("/api/post/create/:userId",requireSignin,upload.single('post_picture'),addPost);
router.get("/api/all/posts/:userId",requireSignin,getAllPosts);
router.get("/api/image/posts/:userId",requireSignin,getImagePosts);
router.get("/api/videos/posts/:userId",requireSignin,getVideoPosts);
router.get("/api/posts/by/:userId",requireSignin,getUserPosts);
router.delete("/api/post/:postId",requireSignin,isOwner,deletPost);
router.put("/api/post/like",requireSignin,likePost);
router.put("/api/post/unlike",requireSignin,unLikePost);
router.put("/api/post/comment",requireSignin,addComment);
router.put("/api/post/unComment",requireSignin,deleteComment);
//Upload


router.param("userId",getUserById);
router.param("postId",getPostById);

module.exports =router;
