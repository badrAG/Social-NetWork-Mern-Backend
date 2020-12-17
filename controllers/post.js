const Post = require("../models/post");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const getAllPosts = (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  Post.find({ PostedBy: { $in: following } })
    .populate("comments", "text created")
    .populate("comments.commentedBy", "_id UserName")
    .populate("PostedBy", "_id UserName")
    .sort("-createdAt")
    .exec((err, posts) => {
      if (err) res.json({ error: err });
      res.json(posts);
    });
};

const getUserPosts = (req, res) => {
  Post.find({ PostedBy: req.profile._id })
    .populate("comments", "text created")
    .populate("comments.commentedBy", "_id UserName")
    .populate("PostedBy", "_id UserName")
    .sort("-createdAt")
    .exec((err, posts) => {
      if (err) res.json({ error: err });
      res.json(posts);
    });
};

const getPostById = (req, res, next, id) => {
  Post.findById(id)
    .populate("comments", "text created")
    .populate("comments.commentedBy", "_id UserName")
    .populate("PostedBy", "_id UserName")
    .exec((err, post) => {
      if (err) res.json({ error: err });
      req.post = post;
      next();
    });
};

const isOwner = (req, res, next) => {
  let isMatch = req.post && req.auth && req.post.PostedBy._id == req.auth._id;
  if (!isMatch) {
    return res.json({ error: "Not Authorized" });
  }
  next();
};

const addPost = async (req, res) => {
  let fileName;
  if (req.file !== null) {
    try {
      if (
        req.file.detectedMimeType != "image/jpg" &&
        req.file.detectedMimeType != "image/png" &&
        req.file.detectedMimeType != "image/jpeg"
      ) {
        throw Error("invalid body.image");
      }
      if (req.file.size > 500000) throw Error("max size");
    } catch (err) {
      return res.status(201).json(err);
    }
    fileName = req.profile._id + Date.now() + ".jpg";
    await pipeline(
      req.file.stream,
      fs.createWriteStream(
        `${__dirname}/../../Social-NetWork-mern-Frontend/public/uploadFile/${fileName}`
      )
    );
  }
  let post = new Post({
    text: req.body.text,
    image: req.file !== null ? "./uploadFile/" + fileName : "",
    PostedBy: req.profile._id,
    video: req.body.video,
  });
  post
  .save((err, data) => {
    if (err) res.json({ error: err });
    res.json(data);
  });
};

const deletPost = (req, res) => {
  let postToDelet = req.post;
  postToDelet.remove((err, deletPost) => {
    if (err) res.json({ error: err });
    res.json(deletPost);
  });
};

const likePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) res.json({ error: err });
    res.json(result);
  });
};

const unLikePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.body.userId } },
    { new: true }
  ).exec((err, result) => {
    if (err) res.json({ error: err });
    res.json(result);
  });
};

const addComment = (req, res) => {
  let comment = { text: req.body.text };
  comment.commentedBy = req.body.userId;
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate("comments", "text created")
    .populate("comments.commentedBy", "_id UserName")
    .populate("PostedBy", "_id UserName")
    .exec((err, result) => {
      if (err) res.json({ error: err });
      res.json(result);
    });
};

const deleteComment = (req, res) => {
  let commentId = req.body.commentId;
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { comments: { _id: commentId } } },
    { new: true }
  )
    .populate("comments", "text created")
    .populate("comments.commentedBy", "_id UserName")
    .populate("PostedBy", "_id UserName")
    .exec((err, result) => {
      if (err) res.json({ error: err });
      res.json(result);
    });
};

module.exports = {
  getAllPosts,
  addPost,
  getUserPosts,
  getPostById,
  isOwner,
  deletPost,
  likePost,
  unLikePost,
  addComment,
  deleteComment,
};
