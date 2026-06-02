const jwt  = require('jsonwebtoken');
const User = require('../Models/User');

// verification
exports.protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // remove bearer
        const token = authHeader.split(' ')[1];

        // verify
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find
        const user = await User.findById(decoded.id);

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