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
    text: `zeal id: ${user.zealID}`,
    html: `<div style="background: #392a30d9;
    padding: 10px;
    margin: 12px;
    transition: box-shadow 0.4s;
    border: 1px solid rgba(0, 0, 0, .125);
    text-align: center;
    border-radius: 12px;
    max-width: 300px;
    margin: auto;
    color: white;
    line-height: 1.5;">
  <img src="${process.env.ZEAL_LOGO}" style="width: 100px;">
  <h4 style="font-size: 1.5rem;
    font-weight: 500;
    line-height: 1.2; 
     margin-top: .5rem!important; font-weight: bolder; margin-bottom: .5rem!important;">
    <span class="font-weight-bolder">${user.name}</span>
  </h4>
  <div>
      <p style="margin: 4px;">Email: <span>${user.email}</span></p>
    <p style="margin: 4px;">Admission Number: <span>${user.admissionNo}</span></p>
    <p style="margin: 4px;">Zeal ID: <span>${user.zealID}</span></p>
  </div>
</div>`
  };
  await transport.sendMail(mailOptions);
};
