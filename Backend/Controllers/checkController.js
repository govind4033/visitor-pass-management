const Pass = require('../models/Pass');
const User = require('../models/User');
const CheckLog = require('../models/CheckLog');
const { sendCheckinAlert } = require('../Utils/sendEmail');
const Appointment = require('../Models/Appointment');

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

    const log = await CheckLog.create({
      pass: pass._id,
      visitor: pass.visitor._id,
      type: "check-in",
      scannedBy: req.user._id,
      location: req.body.location || "Main Gate"
    });

    // ✅ IMPORTANT FIX
    pass.status = "checked-in";
    await pass.save();

    await User.findByIdAndUpdate(pass.visitor._id, {
      status: "checked-in"
    });

    const appointment = await Appointment.findById(pass.appointment).populate("host");

    const host = appointment.host;

    try {
      console.log("Sending email to:", host.email);

      await sendCheckinAlert(host, pass.visitor);

      console.log("Check-in email sent");
    } catch (e) {
      console.log("Check-in email failed:", e.message);
    }

    return res.json({
      message: "Check-in success",
      visitor: pass.visitor,
      pass,   // 🔥 return updated pass
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

    // FIX: Changed 'timestamp' to 'createdAt' to match checkIn
    const last = await CheckLog.findOne({ pass: pass._id })
      .sort({ createdAt: -1 }); 

    // No log found at all
    if (!last)
      return res.status(400).json({ msg: "Must check-in first" });

    // If the latest log is already a check-out
    if (last.type === "check-out")
      return res.status(400).json({ msg: "Already checked out" });

    // Safety fallback
    if (last.type !== "check-in")
      return res.status(400).json({ msg: "Invalid check-out sequence" });

    // Create check-out log
    const log = await CheckLog.create({
      pass: pass._id,
      visitor: pass.visitor._id,
      type: "check-out",
      scannedBy: req.user._id,
      location: req.body.location || "Main Gate"
    });

    // Update pass status
    pass.status = "used";
    await pass.save();

    await User.findByIdAndUpdate(pass.visitor._id, {
      status: "checked-out"
    });

    return res.json({
      message: "Check-out success",
      visitor: pass.visitor,
      pass,
      log
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const { date, type, search, page = 1, limit = 50 } = req.query;

    const query = {};

    if (type) query.type = type;

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: start, $lte: end };
    }

    // SAFE POPULATION SEARCH PIPELINE
    // We fetch the logs normally, but tell populate to filter matches dynamically
    const populateOptions = {
      path: 'visitor',
      select: 'name email phone'
    };

    // If there's a search term, add a match condition inside the populate query
    if (search) {
      populateOptions.match = {
        name: { $regex: search, $options: 'i' }
      };
    }

    let logs = await CheckLog.find(query)
      .populate(populateOptions)
      .populate('scannedBy', 'name')
      .sort({ createdAt: -1 });

    // CRITICAL STEP: If the user searched for a name, Mongoose sets log.visitor to null 
    // for rows that don't match. We filter those out here so only the matched names remain.
    if (search) {
      logs = logs.filter(log => log.visitor !== null);
    }

    // Handle pagination on the filtered results safely
    const total = logs.length;
    const paginatedLogs = logs.slice((page - 1) * limit, page * limit);

    res.json({
      logs: paginatedLogs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
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

exports.getSecurityDashboardStats = async (req, res) => {
    try {

        const start = new Date();
        start.setHours(0,0,0,0);

        const end = new Date();
        end.setHours(23,59,59,999);

        // Today's stats
        const todayCheckIns = await CheckLog.countDocuments({
            type: "check-in",
            timestamp: {
                $gte: start,
                $lte: end
            }
        });

        const todayCheckOuts = await CheckLog.countDocuments({
            type: "check-out",
            timestamp: {
                $gte: start,
                $lte: end
            }
        });

        // Total historical
        const totalCheckIns = await CheckLog.countDocuments({
            type: "check-in"
        });

        const totalCheckOuts = await CheckLog.countDocuments({
            type: "check-out"
        });

        // Currently inside
        const activeVisitors = totalCheckIns - totalCheckOuts;

        // Active passes
        const activePasses = await Pass.countDocuments({
            status: "active"
        });

        res.status(200).json({
            activeVisitors,
            todayCheckIns,
            todayCheckOuts,
            activePasses
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};