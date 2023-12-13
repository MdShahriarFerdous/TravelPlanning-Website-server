const express = require("express");
const {
	userRegister,
	userVerify,
	updateProfile,
	userLogin,
	updateUser,
	getUserInfo,
	getUserById,
} = require("../controllers/userControllers");
const { requireSignIn } = require("../middlewares/authMiddlewares");
const { Upload } = require("../middlewares/imageMiddleware");
const router = express.Router();

//send activation link to register user
router.post("/user-register", userRegister);

//verify user through activation link
router.post("/user-verify", userVerify);

//user login
router.post("/user-login", userLogin);

//update user profile
router.post("/update-profile", requireSignIn, Upload, updateProfile);

//update user
router.post("/update-user", requireSignIn, updateUser);

//get user info
router.get("/user-info", requireSignIn, getUserInfo);

//get user by id
router.get("/user-by-id/:id", getUserById);

module.exports = router;
