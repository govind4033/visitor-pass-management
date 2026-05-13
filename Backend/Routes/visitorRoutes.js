const router = require('express').Router();
const { createVisitor, getAllVisitors, getVisitor, updateVisitor, deleteVisitor } = require('../Controllers/visitorController');
const { protect, authorize } = require("../Middleware/authMiddleware");
const upload = require("../Middleware/uploadMiddleware");

// all routes protected
router.use(protect);

// GET all visitors
router.get('/', authorize('admin', 'security'), getAllVisitors);

// CREATE visitor (with photo upload)
router.post('/', authorize('admin', 'security', 'employee'), upload.single('photo'), createVisitor);

// GET single visitor
router.get('/:id', authorize('admin', 'security', 'employee'), getVisitor);

// UPDATE visitor
router.patch( '/:id', authorize('admin', 'security'), upload.single('photo'), updateVisitor);

// DELETE visitor
router.delete('/:id', authorize('admin'), deleteVisitor);

module.exports = router;