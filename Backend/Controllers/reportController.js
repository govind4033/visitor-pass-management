const Visitor = require('../Models/Visitor');
const Pass = require('../Models/Pass');
const CheckLog = require('../Models/Checklog');

exports.getSummary = async (req, res) => {

    try {

        // today's date range
        const start = new Date();
        start.setHours(0,0,0,0);

        const end = new Date();
        end.setHours(23,59,59,999);

        // counts
        const totalVisitors = await Visitor.countDocuments();

        const todayVisitors = await Visitor.countDocuments({
        createdAt: {
            $gte: start,
            $lte: end
        }
        });

        const activePasses = await Pass.countDocuments({
        status: 'active'
        });

        const todayCheckins = await CheckLog.countDocuments({
        type: 'check-in',
        timestamp: {
            $gte: start,
            $lte: end
        }
        });

        const checkedInVisitors = await Visitor.countDocuments({
        status: 'checked-in'
        });

        // response
        res.json({
        totalVisitors,
        todayVisitors,
        activePasses,
        todayCheckins,
        checkedInVisitors
        });

    } catch (err) {

        res.status(500).json({
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

            count: {
                $sum: 1
            }
            }
        }

        ]);

        res.json({ stats });

    } catch (err) {

        res.status(500).json({
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

            _id: {
                $hour: '$timestamp'
            },

            count: {
                $sum: 1
            }
            }
        }

        ]);

        res.json({ hours });

    } catch (err) {

        res.status(500).json({
        message: err.message
        });

    }

};

exports.exportCSV = async (req, res) => {

    try {

        const visitors = await Visitor.find()

        .populate('hostEmployee', 'name');

        // csv headers
        let csv =
        'Name,Email,Phone,Company,Status\n';

        // rows
        visitors.forEach(v => {

        csv +=
            `${v.name},${v.email},${v.phone},${v.company},${v.status}\n`;

        });

        // response headers
        res.header('Content-Type', 'text/csv');

        res.attachment('visitors.csv');

        // send csv
        res.send(csv);

    } catch (err) {

        res.status(500).json({
        message: err.message
        });

    }

};