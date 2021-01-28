const express = require("express");
const multer = require("multer");
const path = require("path");
const {
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
} = require("../controllers/user");
const {
  login,
  hasAuthorization,
  signout,
  requireSignin,
} = require("../controllers/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./Upload/UserPicture",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${req.profile._id}${path.extname(
        file.originalname
      )}`
    );
  },
});
const upload = multer({
  storage: storage,
});

router.post("/api/users/create", createUser);
router.get("/api/all/users", requireSignin, getAllUsers);
router.put(
  "/api/updateuser/:userId",
  upload.fields([
    {
      name: "user_picture",
      maxCount: 1,
    },
    {
      name: "user_capture",
      maxCount: 1,
    },
  ]),requireSignin,
  updateUser
);
router.delete(
  "/api/users/:userId",
  requireSignin,
  hasAuthorization,
  deleteUser
);
router.get("/api/:userId", requireSignin, getUser);
router
  .route("/api/user/add/follow")
  .put(requireSignin, addFollowing, addFollower);
router
  .route("/api/user/remove/unFollow")
  .put(requireSignin, removeFollowing, removeFollower);

router.get("/api/auth/signout", signout);
router.post("/api/auth/login", login);

router.param("userId", getUserById);

module.exports = router;
