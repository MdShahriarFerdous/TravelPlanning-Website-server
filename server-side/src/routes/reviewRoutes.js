const router = require("express").Router();

const reviewController = require("../controllers/reviewControllers");

router.post("/review", reviewController.createReview);
router.get("/review", reviewController.listReview);
router.post("/review/:id", reviewController.updateReview);
router.get("/review/:id", reviewController.deleteReview);

module.exports = router;
