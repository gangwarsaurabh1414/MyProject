const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const mongoose = require('mongoose');


// createRating
exports.createRating = async (req, res) => {
    try {
        //get user id
        const userId = req.user.id;
        //fetch data from req.body
        const { rating, review, courseId } = req.body;

        //check if user is already enrolled or not
        const courseDetails = await Course.findOne({
            _id: courseId
        }, {
            studentEnrolled: { $elemMatch: { $eq: userId } }
        });

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: "You are not Enrolled in the Course!",
            });
        }

        //check if user is already reviewd the Course or not
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId
        });
        if (!alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "You Already Reviewed the Course!",
            });
        }
        //create rating and review
        const ratingReview = await RatingAndReview.create({
            rating, review,
            course: courseId,
            user: userId
        });

        //update Course
        courseDetails = await Course.findByIdAndUpdate(courseId, {
            $push: {
                ratingAndReview: ratingReview._id,
            }
        }, { new: true });

        console.log("Updated Course : ", courseDetails);

        //return response
        return res.status(200).json({
            success: true,
            message: 'Rating and Review Created Successfully',
            ratingReview
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something Went wrong in createReview Controller"
        })
    }
}

// getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
        //get course Id
        const { courseId } = req.body;

        // calculate average rating
        const result = await RatingAndReview.aggregate([
            {

                $match: {
                    course: new mongoose.Types.ObjectId(`${courseId}`),
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);
        //return ratings
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }

        // if no rating review exits
        return res.status(200).json({
            success: true,
            message: "Average Rating is 0 ,no rating given till now",
            averageRating: 0,
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something Went wrong in getAverageRating Controller"
        });
    }
}

// getAllRating
exports.getAllRatingReview = async (req, res) => {
    try {
        const ratingReview = await RatingAndReview.find({})
            .sort({ rating: 'desc' })
            .populate({
                path: 'user',
                select: 'firstName lastName email image'
            })
            .populate({
                path: 'course',
                select: 'courseName'
            })
            .exec();

        if (!ratingReview) {
            return res.status(401).json({
                success: false,
                message: "No Rating Review Found!"
            });
        }
        return res.status(200).json({
            success: true,
            message: "All reviews are fetched!",
            data: ratingReview
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something Went wrong in getAverageRating Controller"
        });
    }
}


