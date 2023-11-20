const express = require('express');
const bookmarkController = require('../controllers/bookmarkController');
const { requireSignIn } = require("../middlewares/authMiddlewares");
const bookmarkRouter = express.Router();

// CRUD operations

// add bookmark
bookmarkRouter.post('/add-bookmark/:hotelId/:tourId', requireSignIn, bookmarkController.addToBookmarks);

// get bookmark list
bookmarkRouter.get('/get-all-bookmarks', requireSignIn, bookmarkController.getAllBookmarks);


// delete bookmark
bookmarkRouter.delete('/remove-bookmarks', requireSignIn, bookmarkController.removeBookmarks);

module.exports = bookmarkRouter;
