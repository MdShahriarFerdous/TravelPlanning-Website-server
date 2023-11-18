const express = require('express');
const bookmarkController = require('../controllers/bookmarkController');
const bookmarkRouter = express.Router();

// CRUD operations

// add bookmark
bookmarkRouter.post('/bookmarks/:hotelId', bookmarkController.addToBookmarks);

// get bookmark list
bookmarkRouter.get('/getAllBookmarks', bookmarkController.getAllBookmarks);


// delete bookmark
bookmarkRouter.delete('/remove-bookmarks', bookmarkController.removeBookmarks);

module.exports = bookmarkRouter;
