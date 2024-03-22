const jwt = require('jsonwebtoken')
require("dotenv").config()
const User = require('../models/User')

//auth
exports.auth = async (req, res, next) => {
    try {
        //extract token
        const token = req.cookies.token
            || req.body.token
            || req.header("Authorization").replace("Bearer", "");

        // if tokekn missing , then return response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token Is Missing",
            });
        }
        //verify token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Token : ", decode);
            req.user = decode;
        } catch (error) {
            //verification Issue
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating Token,Please try again",
            error: error
        });
    }
}

//isStudent

exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                sucess: false,
                message: "This is Protected Route For Student Only!",
                error: error
            });
        }
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "User Role cannot be verified, please try again",
            error: error
        });
    }
}

//isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                sucess: false,
                message: "This is Protected Route For Instructor Only!",
                error: error
            });
        }
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "User Role cannot be verified, please try again",
            error: error
        });
    }
}


//isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                sucess: false,
                message: "This is Protected Route For Admin Only!",
                error: error
            });
        }
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "User Role cannot be verified, please try again",
            error: error
        });
    }
}


