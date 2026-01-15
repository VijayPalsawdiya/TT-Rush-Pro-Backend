// Challenge rules for rank-based and weekly challenges

exports.getRankChallenge = (userRank) => {
    // Define rank ranges
    const rankRanges = [
        { min: 0, max: 100, name: 'Beginner Challenge' },
        { min: 101, max: 500, name: 'Intermediate Challenge' },
        { min: 501, max: 1000, name: 'Advanced Challenge' },
        { min: 1001, max: Infinity, name: 'Expert Challenge' },
    ];

    return rankRanges.find(range => userRank >= range.min && userRank <= range.max);
};

exports.getWeeklyChallenge = () => {
    const now = new Date();
    const weekNumber = getWeekNumber(now);
    const year = now.getFullYear();

    return {
        weekNumber,
        year,
        name: `Week ${weekNumber} Challenge`,
    };
};

function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
