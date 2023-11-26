const express = require("express");
const {
	userRegister,
	userVerify,
	updateProfile,
	userLogin,
	updateUser,
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

module.exports = router;
