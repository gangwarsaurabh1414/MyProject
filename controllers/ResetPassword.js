const mailSender = require('../utils/mailSender');
const User = require('../models/User');
const bcrypt = require('bcrypt');

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        //get email from req body
        const { email } = req.body;
        //check user for this email , email validation
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: "Your Email is not Registered with Us"
            });
        }
        //generate token
        const token = crypto.randomUUID();
        console.log("Token For reset Password : ", token);
        //update user by adding token and expiration time
        const updatedDetails = await User.findByIdAndUpdate(user._id, { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 }, { new: true });
        console.log("Updated Details = ", updatedDetails);
        //create url
        const url = `http://localhost:3000/update-password/${token}`
        //sent mail containing Url
        const mail = await mailSender(email, "Password Reset Link", `Password Reset Link : ${url}`);
        console.log("Reset Password Mail link", mail);
        //return response
        return res.status(200).json({
            success: true,
            message: "Reset Password Link Sent To your Email",
            data: mail
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went Wrong While sending reset psw mail!"
        });
    }
}

//resetPassword
exports.resetPassword = async (req, res) => {
    try {
        // fetch data
        const { password, confirmPassword, token } = req.body;
        // validate data
        if (!password || !confirmPassword || !token) {
            res.json({
                success: false,
                message: "all fields are required"
            });
        }

        if (password !== confirmPassword) {
            res.json({
                success: false,
                message: "password and ConfirmPassword Not matched!"
            });
        }

        //get user details from db using token
        const user = await User.findOne({ token: token });
        // if no entry  - invalid token
        if (!user) {
            res.json({
                success: false,
                message: "Invalid User Token!"
            });
        }
        //token time check
        if (user.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "Token is Expired ,please regenerate your Token"
            });
        }

        // hash Password
        const hashedpassword = await bcrypt.hash(password, 10);
        //password update
        +

        await User.findByIdAndUpdate(user._id, { password: hashedpassword }, { new: true });

        // return response
        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully!"
        });

    } catch (error) {
        return res.json({
            success: false,
            message: "somethng went wrong while reset of password"
        });
    }
}