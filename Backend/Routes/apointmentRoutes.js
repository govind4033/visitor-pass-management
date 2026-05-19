const router = require('express').Router();

const { createAppointment, getAppointments, approveAppointment, rejectAppointment, cancelAppointment, completeAppointment, getAppointmentById } = require('../Controllers/appointmentController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// nothing much to explain we can understand work by method name
// only these task can work which depend on each other
// pending -> approved -> completed
// pending -> rejected
// approved -> cancelled

router.post('/', authorize('admin', 'employee'), createAppointment);

router.get('/', getAppointments);

router.get('/:id', getAppointmentById);

router.patch('/:id/approve', authorize('admin', 'employee'), approveAppointment);

router.patch('/:id/reject', authorize('admin', 'employee'), rejectAppointment);

router.patch('/:id/cancel', cancelAppointment);

router.patch('/:id/complete', authorize('admin', 'security'), completeAppointment);

module.exports = router;