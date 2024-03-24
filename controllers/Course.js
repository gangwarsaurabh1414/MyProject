const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinaryUploader');

//  createCourse handler function
exports.createCourse = async (req, res) => {
    try {
        //fetch data 
        const { courseName, courseDescription, whatYouWillLearn, price, category } = req.body;
        //get thumbnail
        const thumbnail = req.files.thumbnailImage;
        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail) {
            return res.status(400).json({
                success: false,
                messgae: "All fileds are Required!",
            });
        }
        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Detail : ", instructorDetails);

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details Not found",
            });
        }


        // -:) Is the category is Id or String
        //check given category is Valid or Not
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(402).json({
                success: false,
                message: " category details not found"
            })
        }

        // upload image to cloudinary
        const thumbnailImage = await uploadToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // Create an Entry for new Course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            instructor: instructorDetails._id,
            price,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });

        //add the new course to the schema  of instructor
        await User.findByIdAndUpdate(instructorDetails._id,
            {
                $push: {
                    courses: newCourse._id
                }
            }, { new: true });


        //update the category schema
        await Category.findByIdAndUpdate(categoryDetails._id, {
            $push: {
                courses: newCourse._id,
            }
        }, { new: true });

        // return response
        return res.status(200).json({
            success: true,
            data: newCourse,
            message: "New Course Created Successfully!"
        });

    } catch (error) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while Creating Course",
            error: error.message
        });
    }
}

//  get all courses handler function
exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            price: true,
            thumbnail: true,
            courseName: true,
            instructor: true,
            ratingAndReview: true,
            studentEnrolled: true,
        }).populate("instructor")
            .exec();
        if (!allCourses) {
            return res.status(402).json({
                success: false,
                message: 'Courses are not found!,'
            });
        }
        console.log("All Courses : ", allCourses);
        return res.status(200).json({
            success: true,
            courses: allCourses,
            message: "All COurses Fetched Successsfully"
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while Creating Course",
            message: error.message
        });
    }
}

//  get a particular course details
exports.getCourseDetails = async (req, res) => {
    try {
        //fetch coure Id from req.body
        const { courseId } = req.body;

        // validate course id
        if (!courseId) {
            return res.status(402).json({
                success: false,
                message: "Course Id Is Required!",
            });
        }
        //fetch Course from DB
        const courseDetails = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: 'additionalDetails',
                }
            })
            .populate("category")
            .populate('ratingAndReview')
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection"
                }
            })
            .exec();
        
        //validate course
        if (!courseDetails) {
            return res.status(401).josn({
                success: false,
                message: "Course Not Found Invalid Course Id"
            });
        }

        // return response
        return res.status(200).json({
            success: true,
            message: "Course Details fetched successfully",
            data: courseDetails
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong in getCourseDetails Controller!",
            error: error.message,
        });
    }
}

//  
