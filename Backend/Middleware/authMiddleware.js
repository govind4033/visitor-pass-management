const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// verification
exports.protect = async (req, res, next) => {
    // get token from Authorization header
    const token = token = req.headers.authorization.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    // Verify signature + expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user 
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive){
        return res.status(401).json({ message: 'User no longer valid' });
    }

    req.user = user;
    next();
}

// role based access control
exports.authorize = (...role) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message: `Role '${req.user.role}' not allowed here`
            });
        }
        next();
    }
}