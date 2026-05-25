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
    console.log("BODY:", req.body);

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
      visitor.phone,
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

exports.getPassById = async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id).populate('visitor');

    if (!pass) {
      return res.status(404).json({ msg: "Pass not found" });
    }

    res.status(200).json({
      success: true,
      pass
    });

  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: "Invalid Pass ID format" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPasses = async (req, res) => {
  try {
    // 1. Setup pagination defaults (e.g., page 1, 10 items per page)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 2. Fetch passes with sorting, pagination, and visitor details
    const passes = await Pass.find()
      .populate('visitor')          // Brings in visitor data
      .sort({ createdAt: -1 })      // Newest passes first
      .skip(skip)
      .limit(limit);

    // 3. Get total count for frontend pagination controls
    const totalPasses = await Pass.countDocuments();

    // 4. Return response
    res.status(200).json({
      success: true,
      count: passes.length,
      totalPages: Math.ceil(totalPasses / limit),
      currentPage: page,
      passes
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};