const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const { uploadToCloudinary } = require('../utils/cloudinaryUploader');
require('dotenv').config();
const mongoose = require('mongoose');

exports.createSubSection = async (req, res) => {
    try {
        //fetch data
        const { title, description, timeDuration, sectionId } = req.body;
        // extract video file
        const videoFile = req.files.videoFile;
        // validate data
        if (!title || !description || !timeDuration || !videoFile || !sectionId) {
            return res.status(402).json({
                success: false,
                message: "All fields are required",
            });
        }
        // upload video to cloudinary
        const uploadDetails = await uploadToCloudinary(videoFile, process.env.FOLDER_NAME);
        const videoUrl = uploadDetails.secure_url;
        // create subSection
        const subSectionDetails = await SubSection.create({ title, timeDuration, description, videoUrl });

        // update Section with this subSection
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {
            $push: {
                subSection: subSectionDetails._id,
            }
        }, { new: true });
        //HW Populate to log updated Section 

        // return response
        return res.status(200).json({
            success: true,
            message: "Sub_Section created Successfully",
            subSectionDetails,
            updatedSection
        });
    } catch (error) {
        return res.status(502).json({
            sucess: false,
            message: "Unable to create a Sub Secton , pls try again!",
            error: error.message
        });
    }
}

// HW -- >Update SubSection
exports.updateSubSection = async (req, res) => {
    try {
        //fetch data
        const { subSectionId, title, description, timeDuration } = req.body;
        const videoFile = req.files.videoFile;

        //validate data
        if (!subSectionId || !title || !description || !timeDuration || !videoFile) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        //upload video to Cloudinary
        const uploadDetails = await uploadToCloudinary(videoFile, process.env.FOLDER_NAME);
        const videoUrl = uploadDetails.secure_url;
        // console.log("Subsection secure_url", videoUrl);
        // console.log("Uploaded Details Update Sub Section Controller : ", uploadDetails);

        //update data
        const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId, {
            title,
            timeDuration,
            description,
            videoUrl
        }, { new: true });
        console.log("Update SubSection Controller updatedSubSection: ", updatedSubSection);


        //return response
        return res.status(200).json({
            success: true,
            message: "Sub Section Updated Successfully",
            updatedSubSection
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "unable to update subSection ,pls try again",
            error: error.message
        });
    }
}

// HW--> Delete SubSection
exports.deleteSubSection = async (req, res) => {
    try {
        //fetch data
        const { subSectionId } = req.params;
        //validate data 
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: "Sub Section Id is Required!"
            });
        }
        const deletedSubsection = await SubSection.findByIdAndDelete(subSectionId);
        return res.status(200).json({
            success: true,
            message: "Sub Section Deleted Successfully",
            deletedSubsection,
        });
    } catch (error) {
        return req.status(500).json({
            sucess: false,
            message: "something went wrong while deleting the subsection",
            error: error.message
        });
    }
}

