const express = require('express');
const multer = require('multer');
const path = require("path");
const {AddStory,getStories,isOwner,deletImage,deletStories,getStoryById,addNewStory,addView, getStory} = require("../controllers/stories");
const { requireSignin} = require("../controllers/auth");
const { getUserById} = require("../controllers/user");

const router = express.Router();

const storage = multer.diskStorage({
    destination: './Upload/StoriesPicture',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${req.profile._id}${path.extname(file.originalname)}`)
    }
})
const upload = multer({
    storage:storage
})
router.post("/api/story/create/:userId",upload.single("story_picture"),AddStory);
router.get("/api/all/storeis/:userId",requireSignin,getStories);
router.delete("/api/story/delete/:storyId",deletStories);
router.put("/api/story/remove",deletImage);
router.put("/api/new/story/:userId",upload.single("story_picture"),addNewStory);
router.put("/api/story/view",addView);
router.get("/api/story/:storyId",requireSignin,getStory);


router.param("storyId",getStoryById);
router.param("userId",getUserById);

module.exports =router;