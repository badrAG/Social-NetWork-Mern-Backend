const express = require('express');
const { createUser,getUserById,getUser} = require("../controllers/user");
const { signin ,hasAuthorization,signout,requireSignin} = require("../controllers/auth");

const router = express.Router();

router.post("/api/users/create",createUser);
router.get("/api/user/:userId",getUser);
router.get("/api/auth/signout",signout);
router.post("/api/auth/signin",signin);

router.param("userId",getUserById);

module.exports =router;