const mongoose = require('mongoose');

const checkLogSchema = new mongoose.Schema({
    pass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pass',
        required: [true, 'Log must be linked to a valid pass']
    },
    visitor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visitor',
        required: [true, 'Visitor reference is required for reporting']
    },
    type: {
        type: String,
        enum: ['check-in', 'check-out'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    scannedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'The security personnel ID is required']
    },
    notes: {
        type: String,
        trim: true
    }
}, { 
    timestamps: false
});

module.exports = mongoose.model('CheckLog', checkLogSchema);