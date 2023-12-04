const router = require("express").Router();
const testimonialController = require("../controllers/testimonialController");

router.post("/testimonial", testimonialController.createTestimonial);
router.get("/testimonial", testimonialController.listTestimonials);
router.post("/testimonial/:id", testimonialController.deleteTestimonial);

module.exports = router;
