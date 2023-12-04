const router = require("express").Router();

const reviewController = require("../controllers/reviewControllers");
const { requireSignIn } = require("../middlewares/authMiddlewares");

router.post("/review", requireSignIn, reviewController.createReview);
router.get("/review", reviewController.listReview);
router.post("/review/:id", requireSignIn, reviewController.updateReview);
router.get("/review/:id", requireSignIn, reviewController.deleteReview);

module.exports = router;
