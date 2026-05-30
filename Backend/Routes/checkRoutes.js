const router = require('express').Router();

const { checkIn, checkOut, getLogs, getPassLogs, getSecurityDashboardStats } = require('../controllers/checkController');

const { protect, authorize } = require('../middleware/authMiddleware');

// all routes protected
router.use(protect);

// security only can scan
router.post('/in/', authorize('security'), checkIn);

router.post('/out/', authorize('security'), checkOut);

// admin/security can view logs
router.get('/logs', authorize('admin', 'security'), getLogs);

// for all
router.get( '/logs/:passId', authorize('admin', 'security'), getPassLogs );

router.get('/dashboard', authorize('security'), getSecurityDashboardStats);


module.exports = router;