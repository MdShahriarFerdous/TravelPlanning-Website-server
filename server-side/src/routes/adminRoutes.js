const express = require('express');
const adminController = require('../controllers/adminController');
const { isAdmin } = require("../middlewares/authMiddlewares");
const router = express.Router();




// admin login
router.post("/admin/login", adminController.adminLogin);

// get all users
router.get("/admin/get-all-users", isAdmin, adminController.getAllUsers)


// get user by id
router.get("/admin/get-user-by-id", isAdmin, adminController.getUserById)







module.exports =router;