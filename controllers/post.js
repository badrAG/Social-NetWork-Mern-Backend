const Post = require("../models/post");

const getAllPosts = (req, res) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  Post.find({ PostedBy: { $in: following } })
    .populate("comments", "text created")
    .populate("comments.commentedBy", "_id UserName image")
    .populate("PostedBy", "_id UserName image")
    .sort("-createdAt")
    .limit(5)
    .skip(parseInt(req.query.skip))
    .exec((err, posts) => {
      if (err) res.json({ error: err });
      res.json(posts);
    });
};

const getUserPosts = (req, res) => {
  Post.find({ PostedBy: req.profile._id })
    .populate("comments", "text created")
    .populate("comments.commentedBy", "_id UserName image")
    .populate("PostedBy", "_id UserName image")
    .sort("-createdAt")
    .exec((err, posts) => {
      if (err) res.json({ error: err });
      res.json(posts);
    });
};
 const getImagePosts = (req, res) => {
  Post.find({ PostedBy: req.profile._id })
    .where("image").ne(null)
    .populate("comments", "text created")
    .populate("comments.commentedBy", "_id UserName image")
    .populate("PostedBy", "_id UserName image")
    .sort("-createdAt")
    .exec((err, posts) => {
      if (err) res.json({ error: err });
      res.json(posts);
    });
};
const getVideoPosts = (req, res) => {
  Post.find({ PostedBy: req.profile._id })
    .where("video").ne("")
    .populate("comments", "text created")
    .populate("comments.commentedBy", "_id UserName image")
    .populate("PostedBy", "_id UserName image")
    .sort("-createdAt")
    .exec((err, posts) => {
      if (err) res.json({ error: err });
      res.json(posts);
    });
};
const getPostById = (req, res, next,id) => {
    Post.findById(id)
    .populate("comments", "text created")
    .populate("comments.commentedBy", "_id UserName image")
    .populate("PostedBy", "_id UserName")
    .exec((err, post) => {
      err || !post ? res.json({ error: "Empty Post" }) : (req.post = post);
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
    let picture =  req.file === null || req.file === undefined ? null : "https://api-social-network-mern.herokuapp.com/postPicture/" + req.file.filename;
      let post = new Post({
        text: req.body.text,
        image: picture,
        PostedBy: req.profile._id,
        video: req.body.video,
      });
      post
      .save().then(result => {
        Post
        .populate(post,{path:"PostedBy",select:"_id UserName image"})
        .then(newpost=>{
          res.json(newpost)
        })
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
    .populate("comments.commentedBy", "_id UserName image")
    .populate("PostedBy", "_id UserName image ")
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
    .populate("comments.commentedBy", "_id UserName image")
    .populate("PostedBy", "_id UserName image")
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
  getImagePosts,
  deletPost,
  likePost,
  unLikePost,
  addComment,
  deleteComment,
  getVideoPosts
};
