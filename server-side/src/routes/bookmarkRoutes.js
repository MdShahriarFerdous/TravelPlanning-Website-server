const express = require('express');
const bookmarkController = require('../controllers/bookmarkController');
const { requireSignIn } = require("../middlewares/authMiddlewares");
const router = express.Router();

// CRUD operations

// add bookmark
router.post('/add-bookmark/:hotelId/:tourId', requireSignIn, bookmarkController.addToBookmarks);

// get bookmark list
router.get('/get-all-bookmarks', requireSignIn, bookmarkController.getAllBookmarks);


// delete bookmark
router.delete('/remove-bookmarks', requireSignIn, bookmarkController.removeBookmarks);

module.exports = router;
