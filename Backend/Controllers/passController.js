const Pass = require('../models/Pass');
const Visitor = require('../models/Visitor');
const generateQR = require('../Utils/generateOR');
const generatePDF = require('../Utils/generatePDF');
const crypto = require('crypto');

exports.issuePass = async (req, res) => {
  try {

    // 1. get visitor
    const visitor = await Visitor.findById(req.body.visitorId);
    if (!visitor) return res.status(404).json({ msg: "Visitor not found" });

    // 2. check today's active pass
    const today = new Date();
    today.setHours(0,0,0,0);

    const already = await Pass.findOne({
      visitor: visitor._id,
      status: "active",
      issuedAt: { $gte: today }
    });

    if (already)
      return res.status(400).json({ msg: "Pass already issued today" });

    // 3. create pass code
    const code = `VPMS-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;

    // 4. generate QR + PDF
    const qr = await generateQR(code);
    const pdf = await generatePDF(visitor, code, qr);

    // 5. save pass
    const pass = await Pass.create({
      visitor: visitor._id,
      passCode: code,
      qrCodeUrl: qr,
      pdfUrl: pdf,
      issuedBy: req.user._id,
      status: "active"
    });

    // 6. update visitor
    await visitor.save();

    // 7. response
    res.status(201).json({
      pass,
      download: `/uploads/${pdf}`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};