const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const User = require('../modules/users/user.model');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = user;
        req.user.id = user._id.toString(); // Add id property for easy access
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
