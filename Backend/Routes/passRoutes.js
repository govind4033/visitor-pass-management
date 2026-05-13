const router = require('express').Router();

const { issuePass } = require('../Controllers/passController');
const { protect, authorize } = require('../Middleware/authMiddleware');

// all routes require login
router.use(protect);

// issue pass (security only)
router.post('/', authorize('admin', 'security'), issuePass);

module.exports = router;