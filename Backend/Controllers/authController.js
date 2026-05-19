const User = require('../Models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

const signToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
}

exports.register = async (req, res) => {
    const { name, email, password, role, phone, department } = req.body;

    const exists = await User.findOne({ email });
    if (exists){
        return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.signup({ name, email, password, role, phone, department });

    const token = signToken(user._id)
    res.status(201).json({
        token,
        user: {id: user._id, name, email, role}
    })
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    // verify
    if(!email || !password){
        return res.status(400).json({ message: "Email and Password required" })
    }

    // find
    const user = await User.findOne({email}).select("+password");
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // match
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // expired
    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' });

    // create token
    const token = signToken(user._id)
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } })
}

exports.getMe = async (req, res) => {
    res.json({user: req.user})
}