const Pass = require('../models/Pass');
const Visitor = require('../models/Visitor');
const generateQR = require('../Utils/generateOR');
const generatePDF = require('../Utils/generatePDF');
const crypto = require('crypto');
const { sendPassEmail } = require('../Utils/sendEmail');
const { sendSMS } = require('../Utils/sendSMS');


exports.issuePass = async (req, res) => {
  try {

    // get visitor
    const visitor = await Visitor.findById(req.body.visitorId);
    if (!visitor) return res.status(404).json({ msg: "Visitor not found" });

    // check today active pass
    const today = new Date();
    today.setHours(0,0,0,0);

    const already = await Pass.findOne({
      visitor: visitor._id,
      status: "active",
      issuedAt: { $gte: today }
    });

    if (already)
      return res.status(400).json({ msg: "Pass already issued today" });

    // create pass code
    const code = `VPMS-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;

    // generate QR + PDF
    const qr = await generateQR(code);
    const pdf = await generatePDF(visitor, code, qr);

    // save pass
    const pass = await Pass.create({
      visitor: visitor._id,
      passCode: code,
      qrCodeUrl: qr,
      pdfUrl: pdf,
      issuedBy: req.user._id,
      status: "active"
    });

    await sendSMS(
      appointment.visitor.phone,
      'Your pass has been issued'
    );

    // Send Email
    await sendPassEmail(visitor, pass);

    // update visitor
    await visitor.save();

    // send response
    res.status(201).json({
      pass,
      download: `/uploads/${pdf}`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};