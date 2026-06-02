const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// testing
exports.testEmail = async () => {

  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: 'askrithe40@gmail.com',

    subject: 'Test Email',

    text: 'Email working successfully'
  });

};
 
// appointment email
exports.sendAppointmentEmail = async (visitor, type) => {

  let subject = '';
  let text = '';

  if (type === 'approved') {
    subject = 'Appointment Approved';
    text = `Hello ${visitor.name}, your appointment has been approved.`;
  }

  if (type === 'rejected') {
    subject = 'Appointment Rejected';
    text = `Hello ${visitor.name}, your appointment was rejected.`;
  }

  if (type === 'created') {
    subject = 'Appointment Created';
    text = `Hello ${visitor.name}, your appointment request was created.`;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: visitor.email,
    subject,
    text
  });

};


// pass email
exports.sendPassEmail = async (visitor, pass) => {

  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: visitor.email,

    subject: 'Visitor Pass',

    text: `Your pass code is ${pass.passCode}`,

    attachments: [
      {
        filename: 'visitor-pass.pdf',

        path: path.join(__dirname, '../uploads', pass.pdfFile)
      }
    ]
  });

};


// check-in alert
exports.sendCheckinAlert = async (host, visitor) => {

  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: host.email,

    subject: 'Visitor Arrived',

    text: `${visitor.name} has checked in`
  });

};