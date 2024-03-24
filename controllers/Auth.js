require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const OTP = require('../models/OTP');
const User = require('../models/User');
const cookie = require('cookie-parser');
const Profile = require('../models/Profile');
const otpGenerator = require('otp-generator');


//send OTP
exports.sendotp = async (req, res) => {
    try {
        //fetch email from req body
        const { email } = req.body;

        //check if user already exist
        const checkUserPresent = await User.findOne({ email });

        // if user already exists , then return a response
        if (checkUserPresent) {
            return res.status(400).json({
                success: false,
                message: "User already Registered"
            })
        }

        // generate otp
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })
        console.log("OTP : ", otp);

        // check unique otp or not if not unique then re generate
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            })
            result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp };

        //create an entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body : -> ", otpBody);

        //return response successfully
        return res.status(200).json({
            success: true,
            message: "OTP Sent Successfully",
            otp
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Sign Up
exports.signup = async (req, res) => {
    try {
        // fetch data from req body
        const {
            firstName, lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        // validate data
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }

        // match passs and confirm pass
        if (password != confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password Values are not matched! ,Please Try again"
            });
        }

        // check if user already exists or not
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already Registered"
            })
        }

        // find most recent OTP stored for the User
        const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log("Recent OTP  = ", recentOTP);

        // validate OTP
        if (recentOTP.length == 0) {
            // OTP NOT FOUND
            return res.status(400).json({
                success: false,
                message: "OTP Not Found"
            });
        } else if (otp != recentOTP[0].otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // entry create in DB
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName} `,
        });

        // return res
        return res.status(200).json({
            success: true,
            message: "User is Registered Successfully",
            user,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User Not Registered , Please Try Again!"
        });
    }
}

// LogIn
exports.login = async (req, res) => {
    try {
        // get data from req.body
        const { email, password } = req.body;

        //validate data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required , Please Try Again!"
            });
        }

        //user check exist or not
        const user = await User.findOne({ email }).populate('additionalDetails');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is Not Registered, please Signup first"
            });
        }

        // generate JWT , after password matching
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
            user.token = token;
            user.password = undefined;

            // create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged In!"
            });
        } else {
            return res.status(401).json({
                success: "false",
                message: "Password is Incorrect!",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login Failed , please try Again!"
        });
    }
}

// changePassword
exports.changePassword = async (req, res) => {
    //get data from req body
    //get oldPassword,newPassword,confirmPassword
    //validation

    //update pwd in DB
    //send mail - password changed
    //return response
}