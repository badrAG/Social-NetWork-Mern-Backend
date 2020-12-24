const express = require('express');
const multer = require('multer');
const Upload = multer();
const {AddStory,getStories,isOwner,deletImage,deletStories,getStoryById,addNewStory,addView, getStory} = require("../controllers/stories");
const { requireSignin} = require("../controllers/auth");
const { getUserById} = require("../controllers/user");

const router = express.Router();
router.post("/api/story/create/:userId",requireSignin,Upload.single("file"),AddStory);
router.get("/api/all/storeis/:userId",getStories);
router.delete("/api/story/delete/:storyId",deletStories);
router.put("/api/story/remove",requireSignin,deletImage);
router.put("/api/new/story/:userId",Upload.single("file"),addNewStory);
router.put("/api/story/view",addView);
router.get("/api/story/:storyId",requireSignin,getStory);


router.param("storyId",getStoryById);
router.param("userId",getUserById);

module.exports =router;