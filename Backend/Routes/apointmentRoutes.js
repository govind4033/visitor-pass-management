const router = require('express').Router();

const { createAppointment, getAppointments, approveAppointment, rejectAppointment, cancelAppointment, completeAppointment, getAppointmentById, getVisitorOwnAppointments, getMyVisitors } = require('../Controllers/appointmentController');

const { protect, authorize } = require('../Middleware/authMiddleware');

router.use(protect);

// nothing much to explain we can understand work by method name
// only these task can work which depend on each other
// pending -> approved -> completed
// pending -> rejected
// approved -> cancelled

router.post('/', authorize('visitor'), createAppointment);

router.get('/', authorize('admin', 'employee', 'security'), getAppointments);

router.get('/my-bookings', getVisitorOwnAppointments);

router.get("/my-visitors", protect, authorize("employee"), getMyVisitors);

// not used right know
router.get('/:id', getAppointmentById);

router.patch('/:id/approve', authorize('security', 'employee'), approveAppointment);

router.patch('/:id/reject', authorize( 'employee'), rejectAppointment);

router.patch('/:id/cancel', authorize('visitor', 'security'), cancelAppointment);

router.patch('/:id/complete', authorize('employee'), completeAppointment);

module.exports = router;