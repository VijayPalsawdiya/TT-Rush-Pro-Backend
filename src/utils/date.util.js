// Get week start and end dates (Monday to Saturday)
exports.getWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Calculate days to subtract to get to Monday
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 5); // Saturday
    weekEnd.setHours(23, 59, 59, 999);

    return { weekStart, weekEnd };
};

// Get week number
exports.getWeekNumber = (date = new Date()) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};
