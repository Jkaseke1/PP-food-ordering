const { sendEmail } = require('../config/emailConfig');

const sendOrderConfirmation = async (req, res) => {
  const { userEmail, orderDetails } = req.body;
  const subject = 'Order Confirmation';
  const text = `Thank you for your order! Here are the details:\n\n${orderDetails}`;

  try {
    await sendEmail(userEmail, subject, text);
    res.status(200).json({ message: 'Order confirmation email sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error });
  }
};

module.exports = { sendOrderConfirmation };