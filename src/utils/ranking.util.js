// Calculate user ranking based on wins and losses
exports.calculateRanking = (wins, losses) => {
    const totalMatches = wins + losses;

    if (totalMatches === 0) {
        return 0;
    }

    const winRate = wins / totalMatches;
    const ranking = Math.floor(winRate * 1000 + wins * 10);

    return ranking;
};
