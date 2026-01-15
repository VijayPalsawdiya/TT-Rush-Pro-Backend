const cron = require('node-cron');
const User = require('../modules/users/user.model');

// Run every Sunday at 00:00 to reset weekly stats
const weeklyResetCron = cron.schedule('0 0 * * 0', async () => {
    try {
        console.log('Running weekly reset cron job...');

        await User.updateMany(
            {},
            {
                $set: {
                    weeklyWins: 0,
                    weeklyLosses: 0,
                },
            }
        );

        console.log('Weekly stats reset successfully');
    } catch (error) {
        console.error('Error in weekly reset cron:', error);
    }
});

module.exports = weeklyResetCron;
