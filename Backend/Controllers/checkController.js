const Pass = require('../models/Pass');
const User = require('../models/User');
const CheckLog = require('../models/CheckLog');
const { sendCheckinAlert } = require('../Utils/sendEmail');

exports.checkIn = async (req, res) => {
  try {

    const pass = await Pass.findOne({
      passCode: req.body.passCode
    }).populate('visitor');

    if (!pass)
      return res.status(404).json({ msg: "Invalid pass" });

    if (pass.status !== "active")
      return res.status(400).json({ msg: "Pass not active" });

    if (new Date() > pass.expiresAt)
      return res.status(400).json({ msg: "Pass expired" });

    const last = await CheckLog.findOne({ pass: pass._id })
      .sort({ createdAt: -1 });

    if (last?.type === "check-in")
      return res.status(400).json({ msg: "Already checked in" });

    // create log
    const log = await CheckLog.create({
      pass: pass._id,
      visitor: pass.visitor._id,
      type: "check-in",
      scannedBy: req.user._id,
      location: req.body.location || "Main Gate"
    });

    // ❌ OLD: Visitor update removed
    // await Visitor.findByIdAndUpdate(...)

    // OPTIONAL: if you still want status tracking
    await User.findByIdAndUpdate(pass.visitor._id, {
      status: "checked-in"
    });

    // host notification
    const visitor = pass.visitor;
    const host = await User.findById(visitor.hostEmployee);

    await sendCheckinAlert(host, visitor);

    res.json({
      msg: "Check-in success",
      log
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkOut = async (req, res) => {
  try {

    const pass = await Pass.findOne({
      passCode: req.body.passCode
    }).populate('visitor');

    if (!pass)
      return res.status(404).json({ msg: "Invalid pass" });

    const last = await CheckLog.findOne({ pass: pass._id })
      .sort({ createdAt: -1 });

    if (!last || last.type !== "check-in")
      return res.status(400).json({ msg: "Must check-in first" });

    await CheckLog.create({
      pass: pass._id,
      visitor: pass.visitor._id,
      type: "check-out",
      scannedBy: req.user._id,
      location: req.body.location || "Main Gate"
    });

    pass.status = "used";
    await pass.save();

    // ❌ OLD Visitor update removed
    await User.findByIdAndUpdate(pass.visitor._id, {
      status: "checked-out"
    });

    res.json({ msg: "Check-out success" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {

    const { date, type, page = 1, limit = 50 } = req.query;

    const query = {};

    if (type) query.type = type;

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.createdAt = { $gte: start, $lte: end };
    }

    const logs = await CheckLog.find(query)
      .populate('visitor', 'name email phone')
      .populate('scannedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await CheckLog.countDocuments(query);

    res.json({
      logs,
      total
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPassLogs = async (req, res) => {
  try {

    const logs = await CheckLog.find({
      pass: req.params.passId
    })
      .populate('visitor', 'name email phone')
      .populate('scannedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};