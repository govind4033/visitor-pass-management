const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
    // take object id from visitor schema whose pass is going to be generated
    visitor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Pass must be linked to a visitor']
    },
    // it's optional according to hostemployee if it's a ceo then required if for employee no need
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
    // who issued the pass Admin or Security 
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
        enum: ['active', "checked-in",'used'],
        default: 'active'
    }
}, { timestamps: true });


module.exports = mongoose.models.Pass || mongoose.model('Pass', passSchema);