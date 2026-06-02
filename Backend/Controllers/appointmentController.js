const Appointment = require('../Models/Appointment');
const User = require('../Models/User');
const { sendAppointmentEmail } = require('../Utils/sendEmail');
const { sendSMS } = require('../Utils/sendSMS');

// only in created, approve and reject have the email and sms services

exports.createAppointment = async (req, res) => {
  try {
    // 1. Logged-in visitor context extracted from auth token middleware
    const visitorId = req.user._id;

    // 2. Extract input body variables from the frontend form payload
    const { hostId, visitDate, visitTime, purpose, notes } = req.body;

    // 3. Verify that the requested host employee exists
    const hostEmployee = await User.findOne({ _id: hostId, role: "employee" });
    if (!hostEmployee) {
      return res.status(404).json({
        success: false,
        message: "Host employee not found in our directory.",
      });
    }

    // 4. Combine text date and time into a single valid JavaScript Date object
    const combinedScheduledDate = new Date(`${visitDate}T${visitTime}`);

    // 5. Create the appointment matching your schema properties
    const appointment = await Appointment.create({
      visitor: visitorId,
      host: hostEmployee._id,
      scheduledAt: combinedScheduledDate,
      purpose,
      notes,
    });

    // 6. Communication Alert Notifications
    try {
      await sendAppointmentEmail(req.user, "created");
    } catch (e) {
      console.log("Email notifications dispatch failed:", e.message);
    }

    res.status(201).json({
      success: true,
      appointment,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAppointments = async (req, res) => {
  try {

    const { status, date, page = 1, limit = 20 } = req.query;

    const query = {};

    // employee sees only their appointments
    if (req.user.role === 'employee') {
      query.host = req.user._id;
    }

    if (status) query.status = status;

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.scheduledAt = { $gte: start, $lte: end };
    }

    const appointments = await Appointment.find(query)
      .populate('visitor', 'name email phone photo role')
      .populate('host', 'name email department')
      .populate('approvedBy', 'name')
      .sort({ scheduledAt: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

exports.getVisitorOwnAppointments = async (req, res) => {
  try {
    // Isolate database search parameters purely to the logged-in visitor
    const appointments = await Appointment.find({ visitor: req.user._id })
      .populate('host', 'name email department')
      .sort({ scheduledAt: -1 }); // Sort newest first

    res.status(200).json({
      success: true,
      appointments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyVisitors = async (req, res) => {
  try {

    const appointments = await Appointment.find({
      host: req.user._id,
      status: { $in: ["approved", "completed"] }
    })

    .populate("visitor", "name email phone")

    .sort({ scheduledAt: -1 });

    const visitors = appointments.map((appt) => ({
      _id: appt.visitor?._id,
      name: appt.visitor?.name,
      email: appt.visitor?.email,
      phone: appt.visitor?.phone,
      appointmentDate: appt.scheduledAt,
      appointmentStatus: appt.status,
      purpose: appt.purpose
    }));

    res.json({
      success: true,
      visitors
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

exports.getAppointmentById = async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id)
      .populate('visitor', 'name email phone photo role')
      .populate('host', 'name email department')
      .populate('approvedBy', 'name');

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    if (
      req.user.role === 'employee' &&
      appointment.host._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not allowed"
      });
    }

    res.json({ appointment });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

exports.approveAppointment = async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id)
      .populate('visitor')
      .populate('host', 'name');

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.status !== 'pending')
      return res.status(400).json({
        message: `Already ${appointment.status}`
      });

    appointment.status = 'approved';
    appointment.approvedBy = req.user._id;
    appointment.approvedAt = new Date();

    await appointment.save();

    await sendSMS(appointment.visitor.phone, "your appointment has been approved");

    await sendAppointmentEmail( appointment.visitor, "approved" );

    const updated = await Appointment.findById(appointment._id)
      .populate('visitor', 'name email phone photo')
      .populate('host', 'name email department')
      .populate('approvedBy', 'name');

    res.json({ appointment: updated });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectAppointment = async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment || appointment.status !== 'pending') {
      return res.status(400).json({
        message: "Cannot reject this appointment"
      });
    }

    appointment.status = 'rejected';

    const user = await User.findById(appointment.visitor);

    await sendAppointmentEmail( user, "rejected" );

    await sendSMS(user.phone, "your appointment has been rejected");

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('visitor', 'name email phone photo')
      .populate('host', 'name email department')
      .populate('approvedBy', 'name');

    res.json({
      appointment: updatedAppointment
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

exports.cancelAppointment = async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    if (!['pending', 'approved'].includes(appointment.status)) {
      return res.status(400).json({
        message: "Cannot cancel this appointment"
      });
    }

    appointment.status = 'cancelled';

    const user = await User.findById(appointment.visitor);

    await sendAppointmentEmail( user, "cancelled");

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('visitor', 'name email phone photo')
      .populate('host', 'name email department')
      .populate('approvedBy', 'name');

    res.json({
      appointment: updatedAppointment
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

exports.completeAppointment = async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    if (appointment.status !== 'approved') {
      return res.status(400).json({
        message: "Only approved appointments can be completed"
      });
    }

    appointment.status = 'completed';

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('visitor', 'name email phone photo')
      .populate('host', 'name email department')
      .populate('approvedBy', 'name');

    res.json({
      appointment: updatedAppointment
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};