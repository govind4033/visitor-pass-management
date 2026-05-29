const Pass = require('../models/Pass');
const User = require('../models/User');
const generateQR = require('../Utils/generateOR');
const generatePDF = require('../Utils/generatePDF');
const crypto = require('crypto');
const { sendPassEmail } = require('../Utils/sendEmail');
const { sendSMS } = require('../Utils/sendSMS');

exports.issuePass = async (req, res) => {
  try {

    // get visitor (now from User collection)
    const visitor = await User.findOne({
      _id: req.body.visitorId,
      role: 'visitor'
    });

    if (!visitor)
      return res.status(404).json({ msg: "Visitor not found" });

    // today start
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // prevent multiple active passes per day
    const already = await Pass.findOne({
      visitor: visitor._id,
      status: "active",
      issuedAt: { $gte: today }
    });

    if (already)
      return res.status(400).json({ msg: "Pass already issued today" });

    // generate pass code
    const code = `VPMS-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;

    // generate QR + PDF
    const qr = await generateQR(code);
    const pdf = await generatePDF(visitor, code, qr);

    // create pass
    const pass = await Pass.create({
      visitor: visitor._id,
      passCode: code,
      qrCodeUrl: qr,
      pdfUrl: pdf,
      issuedBy: req.user._id,
      status: "active"
    });

    // notifications
    await sendSMS(visitor.phone, 'Your pass has been issued');
    await sendPassEmail(visitor, pass);

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
    const pass = await Pass.findById(req.params.id)
      .populate('visitor', 'name email phone company role');

    if (!pass)
      return res.status(404).json({ msg: "Pass not found" });

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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const passes = await Pass.find()
      .populate({
        path: 'visitor',
        match: { role: 'visitor' } // IMPORTANT SAFETY FILTER
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPasses = await Pass.countDocuments();

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

exports.getVisitorOwnPasses = async (req, res) => {
  try {
    // 1. Isolate database query lookup using the verified visitor ID from req.user._id
    const passes = await Pass.find({ visitor: req.user._id })
      .populate({
        path: 'appointment',
        populate: { path: 'host', select: 'name department email' } // Deep populates host info details
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: passes.length,
      passes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};