const User = require('../Models/User');
const Pass = require('../Models/Pass');
const CheckLog = require('../Models/Checklog');

exports.getSummary = async (req, res) => {
  try {
    // today range
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // total visitors = users with role visitor
    const totalVisitors = await User.countDocuments({ role: 'visitor' });

    // today visitors (new registrations)
    const todayVisitors = await User.countDocuments({
      role: 'visitor',
      createdAt: { $gte: start, $lte: end }
    });

    // active passes
    const activePasses = await Pass.countDocuments({
      status: 'active'
    });

    // today check-ins
    const todayCheckins = await CheckLog.countDocuments({
      type: 'check-in',
      timestamp: { $gte: start, $lte: end }
    });

    // checked-in visitors (based on logs or pass status)
    const checkedInVisitors = await Pass.countDocuments({
      status: 'checked-in'
    });

    return res.json({
      totalVisitors,
      todayVisitors,
      activePasses,
      todayCheckins,
      checkedInVisitors
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

exports.getDailyStats = async (req, res) => {
  try {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);

    const stats = await CheckLog.aggregate([
      {
        $match: {
          type: 'check-in',
          timestamp: {
            $gte: from,
            $lte: to
          }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$timestamp' },
            month: { $month: '$timestamp' },
            year: { $year: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    return res.json({ stats });

  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

exports.getPeakHours = async (req, res) => {
  try {
    const hours = await CheckLog.aggregate([
      {
        $match: {
          type: 'check-in'
        }
      },
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return res.json({ hours });

  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const visitors = await User.find({ role: 'visitor' });

    let csv = 'Name,Email,Phone,Company\n';

    visitors.forEach(v => {
      csv += `${v.name},${v.email},${v.phone || ''},${v.company || ''}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('visitors.csv');
    return res.send(csv);

  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};