const testimonialModel = require("../models/testimonialModel");

exports.createTestimonial = async (req, res) => {
  try {
    let result = await testimonialModel.create({ ...req.body });
    console.log(result);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    next(error);
    console.error(error.message);
  }
};

exports.listTestimonials = async (req, res) => {
  try {
    let result = await testimonialModel.find({});
    console.log(result);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    next(error);
    console.error(error.message);
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await testimonialModel.findOneAndDelete({ _id: id });
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    next(error);
    console.error(error.message);
  }
};
