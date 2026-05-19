const mongoose = require('mongoose');

const checkLogSchema = new mongoose.Schema({
    // log must be linked to a valid pass
    pass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pass',
        required: true
    },
    // visitor reference is required for reporting
    visitor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visitor',
        required: true
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
    // the security personnel id is required
    scannedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes: {
        type: String,
        trim: true
    }
}, { 
    // already we have set it by date function
    timestamps: false
});

module.exports = mongoose.models.CheckLog || mongoose.model('CheckLog', checkLogSchema);