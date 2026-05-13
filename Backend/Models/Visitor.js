const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    photo: {
      type: String,
    },

    idType: {
      type: String,
      enum: ["aadhar", "passport", "driving_license", "other"],
    },

    idNumber: {
      type: String,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
    },

    purpose: {
      type: String,
      required: true,
      trim: true,
    },

    hostEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pre-registered", "checked-in", "checked-out"],
      default: "pre-registered",
    },

    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    visitDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);