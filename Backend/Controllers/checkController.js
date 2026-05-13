const Pass = require('../models/Pass');
const Visitor = require('../models/Visitor');
const CheckLog = require('../models/CheckLog');

exports.checkIn = async (req, res) => {
    const pass = await Pass.findOne({ passCode: req.body.passCode }).populate('visitor');

    if (!pass) return res.status(404).json({ msg: "Invalid pass" });

    if (pass.status !== "active")
        return res.status(400).json({ msg: "Pass not active" });

    if (new Date() > pass.expiresAt)
        return res.status(400).json({ msg: "Pass expired" });

    const last = await CheckLog.findOne({ pass: pass._id }).sort({ createdAt: -1 });

    if (last?.type === "check-in")
        return res.status(400).json({ msg: "Already inside" });

    const log = await CheckLog.create({
        pass: pass._id,
        visitor: pass.visitor._id,
        type: "check-in",
        scannedBy: req.user._id,
        location: req.body.location || "Main Gate"
    });

    await Visitor.findByIdAndUpdate(pass.visitor._id, { status: "checked-in" });

    res.json({ msg: "Check-in success", log });
};

exports.checkOut = async (req, res) => {
    const pass = await Pass.findOne({ passCode: req.body.passCode }).populate('visitor');

    if (!pass) return res.status(404).json({ msg: "Invalid pass" });

    const last = await CheckLog.findOne({ pass: pass._id }).sort({ createdAt: -1 });

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

    await Visitor.findByIdAndUpdate(pass.visitor._id, {
        status: "checked-out"
    });

    res.json({ msg: "Check-out success" });
};

exports.getLogs = async (req, res) => {
    const { date, type, page = 1, limit = 50 } = req.query;
    const query = {};

    if (type) query.type = type; // 'check-in' or 'check-out'

    if (date) {
        const start = new Date(date); start.setHours(0,0,0,0);
        const end   = new Date(date); end.setHours(23,59,59,999);
        query.timestamp = { $gte: start, $lte: end };
    }

    const logs = await CheckLog.find(query)
        .populate('visitor', 'name email phone')
        .populate('scannedBy', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(+limit);

    res.json({ logs, total: await CheckLog.countDocuments(query) });
};

exports.getPassLogs = async (req, res) => {

  const logs = await CheckLog.find({
    pass: req.params.passId
  })
    .populate('visitor', 'name')
    .populate('scannedBy', 'name')
    .sort({ createdAt: -1 });

  res.json(logs);
};