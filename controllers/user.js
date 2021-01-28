const User = require("../models/user");
const _ = require("lodash");

const createUser = (req, res) => {
  const { name, UserName, email, password } = req.body;
  const user = new User({ name, UserName, email, password });
  user.save((err, user) => {
    err ? res.json({ error: err }) : res.json(user);
  });
};

const deleteUser = (req, res) => {
  let user = req.profile;
  user.remove((err, deleteUser) => {
    if (err) return res.json({ error: err });
    res.json({ message: "Compte deleted" });
  });
};


const getAllUsers = async (req, res) => {
  await User.find((err, users) => {
    if (err || !users) return res.json({ error: err });
    res.json(users);
  }).select("name UserName following email about image createdAt");
};

const updateUser = (req, res) => {
    let user = req.profile;
    user = _.extend(user, req.body);
      if (req.files['user_picture']) {
        user.image = "https://api-social-network-mern.herokuapp.com/userPicture/" + req.files['user_picture'][0].filename;
      }
      if (req.files['user_capture']) {
        user.capture = "https://api-social-network-mern.herokuapp.com/userPicture/" + req.files['user_capture'][0].filename;
      }
    user.save((err, result) => {
      if (err) return res.json({ error: err });
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};
const getUserById = (req, res, next, id) => {
  User.findById(id)
    .populate("following", "_id UserName image")
    .populate("followers", "_id UserName image")
    .exec((err, user) => {
      err || !user ? res.json({ error: "Empty User" }) : (req.profile = user);
      next();
    });
};
const addFollower = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $push: { followers: req.body.userId } },
    { new: true }
  )
    .populate("following", "_id UserName image")
    .populate("followers", "_id UserName image")
    .exec((err, result) => {
      if (err) return res.json({ error: err });
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};

const addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $push: { following: req.body.followId } },
    { new: true },
    (err, result) => {
      if (err) return res.json({ error: err });
      next();
    }
  );
};

const removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.userId,
    { $pull: { following: req.body.followId } },
    { new: true },
    (err, result) => {
      if (err) return res.json({ error: err });
      next();
    }
  );
};

const removeFollower = (req, res, next) => {
  User.findByIdAndUpdate(
    req.body.followId,
    { $pull: { followers: req.body.userId } },
    { new: true }
  )
    .populate("following", "_id UserName image")
    .populate("followers", "_id UserName image")
    .exec((err, result) => {
      if (err) return res.json({ error: err });
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
};

const getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  res.json(req.profile);
};
module.exports = {
  createUser,
  getUserById,
  getUser,
  updateUser,
  getAllUsers,
  deleteUser,
  removeFollowing,
  removeFollower,
  addFollower,
  addFollowing,
};
