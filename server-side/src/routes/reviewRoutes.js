const router = require("express").Router();

<<<<<<< HEAD:server-side/src/routes/reviewRoutes.js
const reviewController = require("../controllers/reviewControllers");
=======
const reviewController = require("../controllers/reviewController");
const { requireSignIn } = require("../middlewares/authMiddlewares");
>>>>>>> development:server-side/src/routes/reviews.js

router.post("/review", requireSignIn, reviewController.createReview);
router.get("/review", reviewController.listReview);
router.post("/review/:id", requireSignIn, reviewController.updateReview);
router.get("/review/:id", requireSignIn, reviewController.deleteReview);

module.exports = router;
