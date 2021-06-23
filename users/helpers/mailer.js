require("dotenv").config();

const nodemailer = require("nodemailer");
const sendinBlue = require('nodemailer-sendinblue-transport');

async function sendEmail(email, code) {
    try {
        const smtpEndpoint = "smtp-relay.sendinblue.com";
        const port = 587;
        const senderAddress = "reviwitapp@gmail.com";
        let toAddress = email;
        const smtpUsername = "reviwitapp@gmail.com";
        const smtpPassword = process.env.SI_APIKEY;
        const subject = "RateIT - Verify Your Email";

        const bodyHTML = `
        <!DOCTYPE!>
        <html>
         <body>
          <p>Your authentication code is: </p> <b>${code}</b>
         </body>
        </html>`;

        let transporter = nodemailer.createTransport({
            service: "SendinBlue",
            auth: {
                user: smtpUsername,
                pass: smtpPassword,
            }
        });

        let mailOptions = {
            to: toAddress,
            from: senderAddress,
            subject: subject,
            html: bodyHTML,
        };

        let info = await transporter.sendMail(mailOptions);
        return { error: false };
    } catch (error) {
        console.error(`send-email-error: ${error}`);
        return {
            error: true,
            message: "Cannot send the email",
        };
    }
}

module.exports = { sendEmail };