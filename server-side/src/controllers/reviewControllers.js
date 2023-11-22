const reviewModel = require("../models/reviewModel");

//! Create Review
exports.createReview = async (req, res, next) => {
  try {
    let { comment, rating } = req.body;

    // Get the logged-in user's ID from the decoded token in req.user
    const userId = req.user._id;

    let result = await reviewModel.create({ user: userId, comment, rating });

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
exports.listReview = async (req, res, next) => {
  try {
    let result = await reviewModel
      .find({})
      .populate({
        path: "user",
        select: "username email -_id",
      })
      .exec();
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
exports.updateReview = async (req, res, next) => {
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
exports.deleteReview = async (req, res, next) => {
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
