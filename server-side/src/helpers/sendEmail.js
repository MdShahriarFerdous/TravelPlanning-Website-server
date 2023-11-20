const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../../secrets");

//send Email
exports.sendEmail = async (emailData) => {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				user: smtpUsername,
				pass: smtpPassword,
			},
		});

		const mailOptions = {
			from: smtpUsername,
			to: emailData.email,
			subject: emailData.subject,
			html: emailData.html,
		};
		return await transporter.sendMail(mailOptions);
	} catch (error) {
		console.error("while sending email");
		throw error;
	}
};
