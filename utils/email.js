/* eslint-disable prettier/prettier */
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    //1) create a transporter (transporter is the service you are gonna use to send the email)

    const transporter = nodemailer.createTransport({
        //     // Service:'Gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        // (in case of gmail) )activate in email "less secure app option"
        // tls: {
        //     ciphers: 'SSLv3'
        // }
        // secure: false // true for 465, false for other ports
    });
    //2) define email options
    const mailOptions = {
        from: 'eslam amged <eslamamged@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html:
    };

    //3)Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
