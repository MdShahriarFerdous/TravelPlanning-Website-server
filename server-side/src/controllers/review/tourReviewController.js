const TourReview = require("../../models/tourmodel/tourReviewModel");
const TourInfo = require("../../models/tourmodel/tourInfoModel");
const TourThumbnail = require("../../models/tourmodel/tourThumbnailModel");

// Create Review
exports.createReview = async (req, res, next) => {
  try {
    let { comment, userRating } = req.body;
    const userId = req.user._id;
    const { tourId } = req.params;

    // search TourInfo
    const search = await TourInfo.find({ tourId: tourId });

    if (search.length === 0) {
      return res.status(404).json({
        error: "Tour Info not found",
      });
    } else {
      const foundTourId = search[0].tourId;
      let result = await TourReview.create({
        user: userId,
        comment,
        rating: userRating,
        tourId: foundTourId,
      });

      const reviewCount = await TourReview.countDocuments({ tourId });
      const ratingsSum = await TourReview.aggregate([
        {
          $match: {
            tourId: tourId,
          },
        },
        {
          $group: {
            _id: "$tourId",
            sumOfRatings: { $sum: "$rating" },
          },
        },
      ]);
      let averageRating;

      if (ratingsSum.length > 0) {
        const sumOfRatings = ratingsSum[0].sumOfRatings;
        averageRating = sumOfRatings / reviewCount;
      }

      await TourThumbnail.findOneAndUpdate(
        { tourInfoId: tourId },
        {
          $set: {
            ratings: averageRating,
            reviewsCount: reviewCount,
          },
        }
      );

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

// List All Review By TourInfoID
exports.listReviewById = async (req, res, next) => {
  try {
    const { tourInfoId } = req.params;

    // search TourInfo
    const search = await TourInfo.find({ tourId: tourInfoId });

    if (search.length === 0) {
      return res.status(404).json({
        error: "Tour Info not found",
      });
    } else {
      const foundTourId = search[0].tourId;
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

// Update a review by Id
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

// Delete review by Id
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
