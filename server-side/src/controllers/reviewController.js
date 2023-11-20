const reviewModel = require("../models/reviewModel");

//! Create Review
exports.createReview = async (req, res) => {
  try {
    let reqBody = req.body;
    let result = await reviewModel.create({ ...reqBody });
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    next(error);
    console.error(error.message);
  }
};

//! List All Review
exports.listReview = async (req, res) => {
  try {
    let result = await reviewModel.find({});
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    next(error);
    console.error(error.message);
  }
};

//! Update a review by Id
exports.updateReview = async (req, res) => {
  try {
    let reqBody = req.body;
    let id = req.params.id;

    let result = await reviewModel.findByIdAndUpdate(
      id,
      { ...reqBody },
      {
        returnDocument: "after",
      }
    );

    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    next(error);
    console.error(error.message);
  }
};

//! Delete review by Id
exports.deleteReview = async (req, res) => {
  try {
    let id = req.params.id;
    let result = await reviewModel.findOneAndDelete(id);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    next(error);
    console.error(error.message);
  }
};
