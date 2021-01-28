const Stories = require("../models/stories");
const AddStory = async (req, res) => {
  let story = new Stories({
    Image: {picture : req.file !== null ? "https://api-social-network-mern.herokuapp.com/storyPicture/" + req.file.filename  : ""},
    StoryBy: req.profile._id,
  });
  story.save().then(result => {
    Stories
    .populate(story,{path:"StoryBy",select:"_id UserName image"})
    .then(newstory=>{
      res.json(newstory)
    })
  });
};

const addNewStory = async(req, res) => {
  let image = {picture : req.file !== null ? "https://api-social-network-mern.herokuapp.com/storyPicture/" + req.file.filename : ""};
  Stories.findByIdAndUpdate(
    req.body.storyId,
    { $push: { Image: image } },
    { new: true }
  )
    .populate("StoryBy", "_id UserName image")
    .exec((err, result) => {
      if (err) res.json({ error: err });
      res.json(result);
    });
};


const getStories = (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  Stories.find({ StoryBy: { $in: following } })
    .populate("StoryBy", "_id UserName image")
    .sort("-createdAt")
    .exec((err, stories) => {
      if (err) res.json({ error: err });
      res.json(stories);
    });
};
const deletStories = (req, res) => {
  let storyToDelet = req.story;
  storyToDelet.remove((err, deletPost) => {
    if (err) res.json({ error: err });
    res.json(deletPost);
  });
};

const deletImage = (req, res) => {
  let imageId = req.body.imageId;
  Stories.findByIdAndUpdate(
    req.body.storyId,
    { $pull: { Image: { _id: imageId } } },
    { new: true }
  )
    .exec((err, result) => {
      if (err) res.json({ error: err });
      res.json(result);
    });
};

const isOwner = (req, res, next) => {
  let isMatch = req.story && req.auth && req.story.StoryBy._id == req.auth._id;
  if (!isMatch) {
    return res.json({ error: "Not Authorized" });
  }
  next();
};

const getStoryById = (req, res,next, id) => {
    Stories.findById(id)
      .populate("StoryBy", "_id UserName image")
      .exec((err, story) => {
        err || !story ? res.json({ error: "Empty Story" }) : (req.story = story);
        next();
      });
  };

  const addView = (req, res) => {
    let image = []
    image.views = req.body.userId;
    Stories.findByIdAndUpdate(
      {_id : req.body.storyId},
      { $push: { Image: image }  },
      { new: true }
    )
    .populate("Image.views", "_id UserName image")
    .exec((err, result) => {
      if (err) res.json({ error: err });
      console.log(image)
      res.json(result);
    });
  };
  const getStory = (req, res) => {
    res.json(req.story);
  };
module.exports = {
  AddStory,
  getStories,
  deletStories,
  isOwner,
  getStoryById,
  addNewStory,
  addView,
  getStory,
  deletImage
};
