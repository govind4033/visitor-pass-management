const Appointment = require('../Models/Appointment');
const Visitor = require('../Models/Visitor');
const sendEmail = require('../Utils/sendEmail');
const { sendSMS } = require('../Utils/sendSMS');

// only in created, approve and reject have the email and sms services

exports.createAppointment = async (req, res) => {
  try {

    // check visitor
    const visitor = await Visitor.findById(req.body.visitorId);

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found"
      });
    }

    // create appointment
    const appointment = await Appointment.create({
      visitor: visitor._id,
      host: req.user._id,
      scheduledAt: req.body.scheduledAt,
      purpose: req.body.purpose,
      notes: req.body.notes
    });

    // send sms
    await sendSMS(
      appointment.visitor.phone,
      'Your appointment has been created'
    )

    // send email
    await sendEmail(
      visitor.email,
      "Appointment Created",
      `Hello ${visitor.name}, your appointment has been created successfully.`
    );

    // send response
    res.status(201).json({ appointment });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

exports.getAppointments = async (req, res) => {
  try {

    const { status, date, page = 1, limit = 20 } = req.query;

    const query = {};

    // employee sees only own appointments
    if (req.user.role === 'employee') {
      query.host = req.user._id;
    }

    // filter by status
    if (status) {
      query.status = status;
    }

    // filter by date
    if (date) {

      const start = new Date(date);
      start.setHours(0,0,0,0);

      const end = new Date(date);
      end.setHours(23,59,59,999);

      query.scheduledAt = {
        $gte: start,
        $lte: end
      };
    }

    // get appointments
    const appointments = await Appointment.find(query)

      .populate('visitor', 'name email phone photo')

      .populate('host', 'name email department')

      .populate('approvedBy', 'name')

      .sort({ scheduledAt: 1 })

      .skip((page - 1) * limit)

      .limit(Number(limit));

    // count total
    const total = await Appointment.countDocuments(query);

    // response
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

exports.getAppointmentById = async (req, res) => {
  try {

    // get appointment by id
    const appointment = await Appointment.findById(req.params.id)

      .populate('visitor', 'name email phone photo')

      .populate('host', 'name email department')

      .populate('approvedBy', 'name');

    // check appointment exists
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    // employee can only view own appointments
    if (
      req.user.role === 'employee' &&
      appointment.host._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not allowed"
      });
    }

    // response
    res.json({ appointment });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

exports.approveAppointment = async (req, res) => {
  try {

    // find appointment
    const appointment = await Appointment.findById(req.params.id)

      .populate('visitor')

      .populate('host', 'name');

    // check exists
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    // only pending appointments allowed
    if (appointment.status !== 'pending') {
      return res.status(400).json({
        message: `Appointment already ${appointment.status}`
      });
    }

    // employee can approve only own appointments
    if (
      req.user.role === 'employee' &&
      appointment.host._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not your appointment"
      });
    }

    // approve appointment
    appointment.status = 'approved';

    appointment.approvedBy = req.user._id;

    appointment.approvedAt = new Date();

    appointment.notified = false;

    await appointment.save();

    // phone sms notification
    await sendSMS(
      appointment.visitor.phone,
      'Your appointment has been approved'
    );

    // send email
    await sendAppointmentNotification(
      appointment.visitor,
      appointment,
      'approved'
    );

    // response
    res.json({ appointment });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

exports.rejectAppointment = async (req, res) => {
  try {

    // get reason
    const { reason } = req.body;

    // find appointment
    const appointment = await Appointment.findById(req.params.id)

      .populate('visitor');

    // check valid appointment
    if (!appointment || appointment.status !== 'pending') {

      return res.status(400).json({
        message: "Cannot reject this appointment"
      });

    }

    // reject appointment
    appointment.status = 'rejected';

    // save rejection reason
    if (reason) {
      appointment.notes = reason;
    }

    await appointment.save();

    // phone sms notification
    await sendSMS(
      appointment.visitor.phone,
      'Your appointment was rejected'
    );

    // send email notification
    await sendAppointmentNotification(
      appointment.visitor,
      appointment,
      'rejected'
    );

    // response
    res.json({ appointment });

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

    if (appointment.status !== 'approved') {
      return res.status(400).json({
        message: "Only approved appointments can be cancelled"
      });
    }

    appointment.status = 'cancelled';

    await appointment.save();

    res.json({ appointment });

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

    res.json({ appointment });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};