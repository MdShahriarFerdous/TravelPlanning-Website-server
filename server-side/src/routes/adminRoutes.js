const express = require('express');
const adminController = require('../controllers/adminController');
const { requireSignIn } = require("../middlewares/authMiddlewares");
const router = express.Router();




// admin login
router.post("/admin/login", adminController.adminLogin);

// get all users
router.get("/admin/get-all-users", requireSignIn, adminController.getAllUsers)

// get user by id
router.get("/admin/get-user-by-id/:userId", requireSignIn, adminController.getUserById)

// update user by id
router.put("/admin/ban-user/:userId", requireSignIn, adminController.updateUserById)


module.exports =router;