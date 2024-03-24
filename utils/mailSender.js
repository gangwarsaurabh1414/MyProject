const nodemailer = require('nodemailer');
require('dotenv').config();
const { emailVerificationMail } = require('../mail/templates/emailVerificationTemplate');


exports.mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });
        let info = await transporter.sendMail({
            from: 'StudyNotion || CodeHelp By Love',
            to: email,
            subject: title,
            html: emailVerificationMail(body)
        },);
        console.log("Mail Info : ", info);
    } catch (error) {
        console.log(error.message);
        console.log("Error in mailSender");

    }
}
