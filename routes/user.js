const express = require('express');
const { 
    createUser,
    getUserById,
    getUser,
    getUserPhoto,
    updateUser,
    getAllUsers,
    deleteUser,
    removeFollowing,
    removeFollower,
    addFollower,
    addFollowing} = require("../controllers/user");
const { signin ,hasAuthorization,signout,requireSignin} = require("../controllers/auth");

const router = express.Router();

router.post("/api/users/create",createUser);
router.get("/api/all/users",requireSignin,getAllUsers);
router.put("/api/user/:userId",requireSignin,hasAuthorization,updateUser);
router.delete("/api/users/:userId",requireSignin,hasAuthorization,deleteUser);
router.get("/api/user/photo/:userId",requireSignin,getUserPhoto);
router.get("/api/user/:userId",getUser);

router.route("/api/user/add/follow").put(requireSignin,addFollowing,addFollower);
router.route("/api/user/remove/unFollow").put(requireSignin,removeFollowing,removeFollower);

router.get("/api/auth/signout",signout);
router.post("/api/auth/signin",signin);

router.param("userId",getUserById);

module.exports =router;