const router = require('express').Router();

const { getSummary, getDailyStats, getPeakHours, exportCSV } = require('../Controllers/reportController');

const { protect, authorize } = require('../Middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/summary', getSummary);

router.get('/daily-stats', getDailyStats);

router.get('/peak-hours', getPeakHours);

router.get('/export-csv', exportCSV);

module.exports = router;