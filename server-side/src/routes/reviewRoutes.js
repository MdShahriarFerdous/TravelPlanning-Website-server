const router = require("express").Router();

// const reviewController = require("../controllers/reviewControllers");
const touReviewController = require("../controllers/review/tourReviewController")
const { requireSignIn } = require("../middlewares/authMiddlewares");

// Tour Review Routes
// create
router.post("/tour/review/:tourId", requireSignIn, touReviewController.createReview)

// Read
router.get("/tour/reviews/:tourInfoId", touReviewController.listReviewById)

// Update
router.put("/tour/review/:id", requireSignIn, touReviewController.updateReview);

// Delete
router.delete("/tour/review/:id", requireSignIn, touReviewController.deleteReview);



// router.post("/review", requireSignIn, reviewController.createReview);
// router.get("/review", reviewController.listReview);
// router.post("/review/:id", requireSignIn, reviewController.updateReview);
// router.get("/review/:id", requireSignIn, reviewController.deleteReview);



module.exports = router;
