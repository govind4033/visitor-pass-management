const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    // link to user account (visitor login)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // REQUIRED photo (store filename or url)
    photo: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
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
  { timestamps: true }
);

module.exports = mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);