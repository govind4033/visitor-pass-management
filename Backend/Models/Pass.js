const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
    visitor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visitor',
        required: [true, 'Pass must be linked to a visitor']
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
    },
    passCode: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        trim: true
        // Example: VPMS-2026-A3X9
    },
    qrCodeUrl: {
        type: String,
        required: true
    },
    pdfUrl: {
        type: String
    },
    issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    issuedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: () => {
            const d = new Date();
            d.setHours(23, 59, 59, 999);
            return d;
        }
    },
    status: {
        type: String,
        enum: ['active', 'used', 'expired', 'revoked'],
        default: 'active'
    }
}, { timestamps: true });


module.exports = mongoose.model('Pass', passSchema);