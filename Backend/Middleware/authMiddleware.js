const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// verification
exports.protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        console.log("TOKEN:", token);
        console.log("USER:", decoded);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// role based access control
exports.authorize = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Role '${req.user.role}' not allowed here`
            });
        }

        next();
    };
};