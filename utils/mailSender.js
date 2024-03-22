const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
        let info = transporter.sendMail({
            from: 'StudyNotion || CodeHelp By Love',
            to: email,
            subject: title,
            html: body
        },);
        console.log("Mail Info : ", info);
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = mailSender;