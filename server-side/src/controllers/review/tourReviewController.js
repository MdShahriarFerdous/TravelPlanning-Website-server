const TourReview = require("../../models/tourmodel/tourReviewModel");
const TourInfo = require("../../models/tourmodel/tourInfoModel");

//! Create Review
exports.createReview = async (req, res, next) => {
  try {
    let { comment, userRating } = req.body;

    const userId = req.user._id;
    const { tourId } = req.params;
    console.log("tourId:",tourId)

    // search TourInfo
    const search = await TourInfo.find({ tourId: tourId });
    console.log("search: ", search);

    if (search.length === 0) {
      return res.status(404).json({
        error: "Tour Info not found",
      });
    } else {
      const foundTourId = search[0].tourId;

      console.log("tourId: ", foundTourId);

      let result = await TourReview.create({
        user: userId,
        comment,
        rating: userRating,
        tourId: foundTourId,
      });

      return res.status(200).json({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    next(error);
    console.error(error.message);
  }
};

//! List All Review By TourInfoID
exports.listReviewById = async (req, res, next) => {
  try {
    const { tourInfoId } = req.params;
    console.log("tourId :", tourInfoId);

    // search TourInfo
    const search = await TourInfo.find({ tourId: tourInfoId });
    console.log(search);

    if (search.length === 0) {
      return res.status(404).json({
        error: "Tour Info not found",
      });
    } else {
      const foundTourId = search[0].tourId;
      console.log("tourID: ",foundTourId)
      const reviews = await TourReview.find({ tourId: foundTourId })
        .populate({
          path: "user",
          select: "username",
        })
        .exec();
      const totalReviews = reviews.length;

      if (!reviews || totalReviews === 0) {
        return res.status(404).json({
          success: false,
          message: "No reviews",
        });
      }
      console.log("reviews: ", reviews);

      return res.status(200).json({
        success: true,
        data: {
          totalReviews: totalReviews,
          reviews: reviews,
        },
      });
    }
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

    let result = await TourReview.findByIdAndUpdate(
      id,
      { ...reqBody },
      {
        returnDocument: "after",
      }
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
    console.error(error.message);
  }
};

//! Delete review by Id
exports.deleteReview = async (req, res, next) => {
  try {
    let _id = req.params.id;
    let result = await TourReview.findOneAndDelete({ _id });
    if (!result) {
      return res.status(404).json({
        message: "review not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
    console.error(error.message);
  }
};
