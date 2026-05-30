const router = require('express').Router();

const { issuePass, getPassById, getAllPasses, getVisitorOwnPasses } = require('../Controllers/passController');
const { protect, authorize } = require('../Middleware/authMiddleware');

// all routes require login
router.use(protect);

// generate pass (security only)
router.post('/', authorize('security'), issuePass);

router.get('/my-passes', authorize('visitor'), getVisitorOwnPasses);

router.get('/:id', authorize('admin', 'security'), getPassById);

router.get('/', authorize('visitor', 'security'), getAllPasses);

// 1. admin or security issue Pass
// 2. finds visitor
// 3. checks duplicate active pass if exit
// 4. creates pass
// 5. generates QR
// 6. generates PDF
// 7. store on mongoDB
// 8. return download link to download pass

module.exports = router;