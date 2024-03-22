const Profile = require('../models/Profile');
const User = require('../models/User');
const Course = require('../models/Course');

exports.updateProfile = async (req, res) => {
    try {

        //get dat a
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
        const userId = req.user.id;
        // validate data
        if (!contactNumber || !gender || !userId) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Required",
            });
        }

        //find User
        const userDetails = await User.findById(userId);
        // find profile
        const profileId = userDetails.additionalDetails;

        // update profile
        const updatedProfile = await Profile.findByIdAndUpdate(profileId, {
            dateOfBirth,
            about,
            contactNumber,
            gender,
        }, { new: true });
        updatedProfile.contactNumber = "";

        //return response
        return res.status(200).json({
            success: true,
            message: "Profile Updated SuccessFully",
            updatedProfile,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//Delete Account
// Explore --> how we can scheduke this deletion operation
exports.deleteAccount = async (req, res) => {
    try {
        // get user Id
        const id = req.user.id;
        // validate Id
        const userDetails = await User.findById(id);

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "User Not found!"
            })
        }

        // delete user profile
        await Profile.findByIdAndDelete(userDetails.additionalDetails);

        //TODO : : HW un enrolled User from all enrolled courses;
        // const courseDetails = Course.find({});

        // delete user
        await User.findByIdAndDelete(id);

        //return response
        return res.status(200).json({
            success: true,
            message: "User Deleted Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

//get User All details

exports.getAllUserDetails = async (req, res) => {
    try {
        //get id
        const id = req.user.id;
        //validate id and get user details
        const userDetails = await User.findById(id).populate('additionalDetails').exec();
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "User Not Found !"
            });
        }
        //return response
        return res.status(200).json({
            success: true,
            message: "User Details Fetched Successfully",
            userDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong While fetching the User Details",
            error: error.message
        })
    }
}