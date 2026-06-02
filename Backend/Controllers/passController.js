const Pass = require('../Models/Pass');
const User = require('../Models/User');
const Appointment = require('../Models/Appointment');
const generateQR = require('../Utils/generateOR');
const generatePDF = require('../Utils/generatePDF');
const crypto = require('crypto');
const { sendPassEmail } = require('../Utils/sendEmail');
const { sendSMS } = require('../Utils/sendSMS');

exports.issuePass = async (req, res) => {

  try {

    const { visitorId, appointmentId } = req.body;

    // visitor
    const visitor = await User.findOne({
      _id: visitorId,
      role: 'visitor'
    });

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found"
      });
    }

    // appointment
    const appointment = await Appointment.findById(appointmentId)
      .populate('host', 'name department');

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    // only approved appointments
    if (appointment.status !== 'approved') {
      return res.status(400).json({
        message: "Only approved appointments can generate passes"
      });
    }

    // already generated
    const existingPass = await Pass.findOne({
      appointment: appointment._id
    });

    if (existingPass) {
      return res.status(400).json({
        message: "Pass already generated"
      });
    }

    // generate pass code
    const code =
      `VPMS-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;

    // qr
    let qr = null;

    try {
      qr = await generateQR(code);
    } catch (e) {
      console.log("QR generation failed:", e.message);
    }

    // pdf
    let pdf = null;

    try {
      pdf = await generatePDF(visitor, code, qr);
    } catch (e) {
      console.log("PDF generation failed:", e.message);
    }

    // create pass
    const pass = await Pass.create({

      visitor: visitor._id,

      appointment: appointment._id,

      passCode: code,

      qrCodeUrl: qr,

      pdfFile: pdf,

      pdfUrl: `${process.env.BASE_URL}/uploads/${pdf}`,

      issuedBy: req.user._id,

      status: "active"
    });

    // notifications (optional-safe)
    try {

      if (visitor.phone) {
        await sendSMS(visitor.phone, 'Your visitor pass has been generated.' );
      }

    } catch (e) {

      console.log("SMS failed:", e.message);

    }

    try {

      await sendPassEmail(visitor, pass);

    } catch (e) {

      console.log("Email failed:", e.message);

    }

    res.status(201).json({
      success: true,
      pass,
      download: pdf ? `/uploads/${pdf}` : null
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

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