const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASS
  }
});

module.exports = async user => {
  let mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Zealicon Registraion",
    text: `zeal id: ${user.zealID}`
  };
  await transport.sendMail(mailOptions);
};
