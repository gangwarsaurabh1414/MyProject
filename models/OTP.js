const mongoose = require('mongoose');
const { mailSender } = require('../utils/mailSender');
const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 300 ,
    }
});

// function to send email
async function sendVerificationEmail(email, otp) {
    try {                          //[ mailSender(email, title, body ) arguments ]             
        const mailResponse = await mailSender(email, "Verifivation Email From StudyNotion", otp);
        console.log("Email Sent Successfully : ", mailResponse);
    } catch (error) {
        console.log("Error Occured while sending mail : ", error);
        throw error;
    }
}

OTPSchema.pre('save', async function (next) {
    console.log("OTP Model : email ->", this.email, " OTP : -> ", this.otp);
    await sendVerificationEmail(this.email, this.otp);// this is current object
    next();
});

module.exports = mongoose.model("OTP", OTPSchema);