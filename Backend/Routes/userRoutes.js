const router = require('express').Router();
const { getAllUsers, createUser, getUserById, updateUser, deleteuser, getMyProfile, updateProfile } = require('../Controllers/userController');
const { protect, authorize } = require("../Middleware/authMiddleware");
const upload = require("../Middleware/uploadMiddleware");

// All routes are protected by default
router.use(protect);

router.get('/', authorize('admin', 'visitor'), getAllUsers);

router.post('/', authorize('admin'), createUser);

router.get('/me', getMyProfile);

router.put('/me', upload.single('photo'), updateProfile);

router.get('/:id', authorize('admin', 'visitor'), getUserById);

router.patch('/:id', authorize('admin'), updateUser);

router.delete('/:id', authorize('admin'), deleteuser);

module.exports = router;