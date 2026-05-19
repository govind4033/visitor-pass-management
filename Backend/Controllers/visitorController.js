const Visitor = require('../Models/Visitor');


// Create visitor
exports.createVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      purpose: req.body.purpose,
      hostEmployee: req.body.hostEmployee,
      visitDate: req.body.visitDate,
      // if uploaded
      photo: req.file ? req.file.filename : null,
      // by whom like admin, security or employee
      registeredBy: req.user._id,
      status: "pre-registered"
    });

    res.status(201).json({ visitor });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all visitors
exports.getAllVisitors = async (req, res) => {
  try {
    const { search, status } = req.query;

    let query = {};

    // search by name/email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    const visitors = await Visitor.find(query)
      .sort({ createdAt: -1 })
      .populate('hostEmployee', 'name email department')
      .populate('registeredBy', 'name');

    res.json({ visitors });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get visitor by id
exports.getVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate('hostEmployee', 'name email phone department');

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.json({ visitor });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update visitor
exports.updateVisitor = async (req, res) => {
  try {
    const updates = { ...req.body };

    // access photo
    if (req.file) {
      updates.photo = req.file.filename;
    }

    // prevent changing sensitive fields
    delete updates.registeredBy;

    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.json({ visitor });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete visitor
exports.deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.json({ message: 'Visitor deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};