const Course = require('../models/Course');
const Section = require('../models/Section');


exports.createSection = async (req, res) => {
    try {

        //data fetch
        const { sectionName, courseId } = req.body;

        //validate data
        if (!sectionName || !courseId) {
            return res.status(402).json({
                success: false,
                message: "All Fields are Required for Creating a Section!"
            });
        }

        //create Section
        const newSection = await Section.create({
            sectionName,
        });

        // Update Course Schema
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, {
            $push: {
                courseContent: newSection._id,
            }
        }, { new: true }).populate({
            path: 'courseContent',
            populate: { path: 'subSection' }
        });
        //HW populate updatedCourseDetails as it will contain Section,subsection Details instead of its _id

        //send Success Message
        return res.status(200).json({
            success: true,
            newSection: newSection,
            updatedCourseDetails,
            message: "New Section Created Successfully!"
        });

    } catch (error) {
        return res.status(500), json({
            success: false,
            message: "Something went Wrong While creating a Section",
            error: error.message,
        });
    }
}

exports.updateSection = async (req, res) => {
    try {
        // fetch data
        const { sectionName, sectionId } = req.body;
        // validate 
        if (!sectionName || !sectionId) {
            return res.status(402).json({
                success: false,
                message: "All Fields are Required"
            })
        }
        
        // update data
        const updatedSection = await Section.findByIdAndUpdate(sectionId, { sectionName: sectionName }, { new: true });
        
        //return response
        return res.status(200).json({
            success: true,
            message: "Seection Updated Successfully!",
            updatedSection: updatedSection
        });
    } catch (error) {
        return res.status(500), json({
            success: false,
            message: "Something went Wrong While Updating a Section",
            error: error.message,
        });
    }
}

exports.deleteSection = async (req, res) => {
    try {
        ///fetch Data from req.params
        const { sectionId } = req.params;
        //validate data
        if (!sectionId) {
            return res.status(402).json({
                success: false,
                message: "All fields are required"
            });
        }
        
        //remove the section from the Course
        // await Course.findById

        //delete section
        const deletedSection = Section.findByIdAndDelete(sectionId);

        //return response
        return res.status(200).json({
            success: true,
            message: "Section deleted Successfully",
            deletedSection: deletedSection
        });
    } catch (error) {
        return res.status(500), json({
            success: false,
            message: "Something went Wrong While deleting a Section",
            error: error.message,
        })
    }
}
