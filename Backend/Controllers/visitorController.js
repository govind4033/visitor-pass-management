const Visitor = require('../Models/Visitor');


// CREATE
exports.createVisitor = async (req, res) => {
  try {
    const visitorData = {
      ...req.body,
      photo: req.file ? req.file.filename : null,
      registeredBy: req.user._id,
      status: 'pre-registered'
    };

    const visitor = await Visitor.create(visitorData);

    res.status(201).json({ visitor });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL VISITOR
exports.getAllVisitors = async (req, res) => {
  try {
    const { search, status } = req.query;

    let query = {};

    // search by name/email
    if (search) {
      query = {
        $or: [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') }
        ]
      };
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

// GET VISITOR BY ID
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

// UPDATE
exports.updateVisitor = async (req, res) => {
  try {
    const updates = { ...req.body };

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

// DELETE
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