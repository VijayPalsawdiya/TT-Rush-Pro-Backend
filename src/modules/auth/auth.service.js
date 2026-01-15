const { verifyGoogleToken } = require('../../config/googleAuth');
const User = require('../users/user.model');
const { generateToken, generateRefreshToken } = require('../../utils/jwt.util');

exports.googleLogin = async (token) => {
    const payload = await verifyGoogleToken(token);

    let user = await User.findOne({ email: payload.email });

    if (!user) {
        user = await User.create({
            email: payload.email,
            name: payload.name,
            profilePicture: payload.picture,
            googleId: payload.sub,
        });
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return {
        user,
        accessToken,
        refreshToken,
    };
};

exports.refreshToken = async (refreshToken) => {
    const user = await User.findOne({ refreshToken });

    if (!user) {
        throw new Error('Invalid refresh token');
    }

    const accessToken = generateToken(user);

    return { accessToken };
};

exports.logout = async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
};
