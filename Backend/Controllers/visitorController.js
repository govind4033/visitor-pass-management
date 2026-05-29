const Visitor = require("../Models/Visitor");

exports.createVisitor = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Photo is required",
      });
    }

    const {
      name,
      email,
      phone,
      company,
      purpose,
      hostEmployee,
      visitDate,
      idType,
      idNumber,
    } = req.body;

    const visitor = await Visitor.create({
      user: req.user._id,
      name,
      email,
      phone,
      company,
      purpose,
      hostEmployee,
      visitDate,
      idType,
      idNumber,
      registeredBy: req.user._id,

      //store filename
      photo: req.file.filename,
    });

    res.status(201).json({ visitor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllVisitors = async (req, res) => {
  try {
    const { search, status } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const visitors = await Visitor.find(query)
      .populate("hostEmployee", "name email department")
      .populate("registeredBy", "name")
      .sort({ createdAt: -1 });

    res.json({ visitors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate("hostEmployee", "name email department")
      .populate("registeredBy", "name");

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    res.json({ visitor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateVisitor = async (req, res) => {
  try {
    const updates = { ...req.body };

    // if new photo uploaded
    if (req.file) {
      updates.photo = req.file.filename;
    }

    // prevent role abuse
    delete updates.registeredBy;
    delete updates.user;

    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    res.json({ visitor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found",
      });
    }

    res.json({ message: "Visitor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};