require('dotenv').config();
const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config/env');

async function checkMatches() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const Match = require('../modules/matches/match.model');

        // Get all matches
        const allMatches = await Match.find()
            .populate('player1', 'name')
            .populate('player2', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        console.log(`📊 Total matches in database: ${allMatches.length}\n`);

        if (allMatches.length > 0) {
            console.log('Recent matches:');
            allMatches.forEach((match, index) => {
                console.log(`\n${index + 1}. Match ID: ${match._id}`);
                console.log(`   Player 1: ${match.player1?.name || match.player1} (${match.player1?._id || match.player1})`);
                console.log(`   Player 2: ${match.player2?.name || match.player2} (${match.player2?._id || match.player2})`);
                console.log(`   Status: ${match.status}`);
                console.log(`   Match Date: ${match.matchDate}`);
                console.log(`   Challenge ID: ${match.challengeId || 'N/A'}`);
                console.log(`   Created: ${match.createdAt}`);
            });
        } else {
            console.log('❌ No matches found in database!');
            console.log('\nPossible reasons:');
            console.log('1. No challenges have been accepted yet');
            console.log('2. Match creation failed silently');
            console.log('3. Wrong database connection');
        }

        // Check pending matches specifically
        const pendingMatches = await Match.find({ status: 'pending' })
            .populate('player1', 'name')
            .populate('player2', 'name');

        console.log(`\n📋 Pending matches: ${pendingMatches.length}`);

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkMatches();
