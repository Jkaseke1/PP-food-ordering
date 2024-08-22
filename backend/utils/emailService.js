const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Outlook', // Specify the email service
  auth: {
    user: process.env.EMAIL_USER, // Get the email from environment variables
    pass: process.env.EMAIL_PASS   // Get the password from environment variables
  }
});

// Function to send an email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Use the email from environment variables
    to,
    subject,
    text
  };

  return transporter.sendMail(mailOptions)
    .then(info => {
      console.log('Email sent: ' + info.response);
      return info;
    })
    .catch(error => {
      console.error('Error sending email:', error);
      throw error;
    });
};

module.exports = { sendEmail };