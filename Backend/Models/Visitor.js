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

    // optional photo file name in string which is stored in uploads folder
    photo: {
      type: String,
    },

    // not required optional for more authetic user or for security purpose
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

    // whom visitor want to meet take from User schema
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

    // who allowed user to register like admin, scurity and employee
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

// if model already created then use it otherwise create 
module.exports = mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);