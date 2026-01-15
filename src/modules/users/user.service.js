const User = require('./user.model');

exports.getUserById = async (userId) => {
    const user = await User.findById(userId).select('-refreshToken');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

exports.updateUser = async (userId, updateData) => {
    // Check if profile is being completed
    if (updateData.gender && updateData.phoneNumber && updateData.gameType) {
        updateData.isProfileComplete = true;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select('-refreshToken');

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

exports.updateFCMToken = async (userId, fcmToken) => {
    await User.findByIdAndUpdate(userId, { fcmToken });
};
