// Calculate win percentage
exports.calculateWinPercentage = (wins, losses) => {
    const totalMatches = wins + losses;

    if (totalMatches === 0) {
        return 0;
    }

    return ((wins / totalMatches) * 100).toFixed(2);
};
