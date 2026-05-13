const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { 
        type: String, 
        enum: ['admin', 'security', 'employee']
    },
    phone: {type: String, trim: true},
    department: {type: String, trim: true},
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Static Signup Method
userSchema.statics.signup = async function (data) {
    const { name, email, password, role } = data;

    // 1. Validation
    if (!email || !password || !name) {
        throw Error('All fields must be filled');
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough (Need: 8+ chars, Uppercase, Lowercase, Number, Symbol)');
    }

    const exists = await this.findOne({ email });
    if (exists) {
        throw Error('Email already in use');
    }

    // 2. Hashing
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // 3. Create User
    const user = await this.create({ name, email, password: hash, role });
    return user;
};

// Static Login Method
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect password');
    }

    return user;
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);