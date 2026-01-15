const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } = require('../config/env');

exports.generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

exports.generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        JWT_REFRESH_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );
};

exports.verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

exports.verifyRefreshToken = (token) => {
    return jwt.verify(token, JWT_REFRESH_SECRET);
};
