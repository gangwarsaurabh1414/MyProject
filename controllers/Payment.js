const { instance } = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');
const mongoose = require('mongoose');
const crypto = require('crypto');


// Capture the payment and initiate the  Razorpay order
exports.capturePayment = async (req, res) => {
    try {
        // get Course Id and User Id
        const { course_id } = req.body;
        const userId = req.user.id;

        // valid CourseId
        if (!course_id) {
            return res.json({
                success: false,
                message: "Please Provide a Valid Course Id",
            });
        }

        // valid CourseDetails
        const courseDetails = await Course.findById(course_id);
        if (!courseDetails) {
            return res.json({
                success: false,
                message: "Invalid Course Id",
            });
        }

        // check user already pay for the Same Course
        // convert the present userid to mongooose .types.objectID
        const uid = new mongoose.Types.ObjectId(`${userId}`);
        if (courseDetails.studentEnrolled.includes(uid)) {
            return res.status(200).json({
                success: false,
                message: "Student is Already Enrolled ",
            });
        }

        // create order
        const amount = courseDetails.price;
        const currency = "INR";
        const options = {
            price: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes: {
                courseId: course_id,
                userId
            }
        }
        const paymentResponse = instance.orders.create(options);
        console.log("Payment Response : ", paymentResponse);

        // return res
        return res.status(200).json({
            success: true,
            courseName: courseDetails.courseName,
            courseDescription: courseDetails.courseDescription,
            thumbnail: courseDetails.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Some error in capturePayment Controlller ,${error.message}`,
            message: "Internal Server Error"
        });
    }
}

exports.verifySignature = async (req, res) => {

    const webhookSecret = "12345678";
    const signature = req.headers['x-razorpay-signature'];

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (signature == digest) {
        console.log('payment is authorised');
        const { courseId, userId } = req.body.payload.entity.notes;
        try {
            //full fill the action

            //find the course and enroll the student
            const enrolledCourse = await Course.findByIdAndUpdate(courseId, {
                $push: {
                    studentEnrolled: userId,
                }
            }, { new: true });

            if (!enrolledCourse) {
                return res.status(500).json({
                    sucess: false,
                    message: "Something went  wrong while enrolling the new Student"
                });
            }
            console.log("Enrolled Student Details ", enrolledStudent);

            //find the student and update its Course field
            const enrolledStudent = await User.findByIdAndUpdate(userId, {
                $push: {
                    courses: courseId,
                }
            }, { new: true });
            console.log("Updated User After Enrolling in Course ", updatedUser);

            //Send course enrollment confirmation email
            const emailResponse = await mailSender(enrolledStudent.email, "Congragulation from Saurabh!", "Congragulation You onboarded into new Course");
            console.log("email response : ", emailResponse);


            return res.status(200).json({
                success: true,
                message: "Signanture Verified and Course Added!"

            })



        } catch (error) {
            return res.status(500).json({
                sucess: false,
                message: "Error in Verify Signature Controller",
                error: error.message,
            });
        }
    }

    return res.status(401).json({
        success: false,
        message: 'Invalid Signatue , Payment Failed'
    })


}
