const router = require('express').Router();

const { getSummary, getDailyStats, getPeakHours, exportCSV } = require('../controllers/reportController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin', 'security'));

router.get('/summary', getSummary);

router.get('/daily', getDailyStats);

router.get('/peak-hours', getPeakHours);

router.get('/export/csv', exportCSV);

module.exports = router;