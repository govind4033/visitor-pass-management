const router = require('express').Router();

const { checkIn, checkOut, getLogs, getPassLogs } = require('../controllers/checkController');

const { protect, authorize } = require('../middleware/authMiddleware');

// all routes protected
router.use(protect);

// security only can scan
router.post('/checkin/:passId', authorize('security'), checkIn);

router.post('/checkout/:passId', authorize('security'), checkOut);

// admin/security can view logs
router.get('/checklogs', authorize('admin', 'security'), getLogs);

// for all
router.get( '/checklogs/:passId', authorize('admin', 'security'), getPassLogs );

module.exports = router;