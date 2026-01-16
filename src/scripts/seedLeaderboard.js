/**
 * Seed Script for Leaderboard Dummy Data
 * 
 * This script populates MongoDB with dummy user data for testing the leaderboard.
 * Includes male and female players with various stats.
 * 
 * Usage:
 *   node src/scripts/seedLeaderboard.js
 */

// Load environment variables FIRST
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../modules/users/user.model');
const { MONGODB_URI } = require('../config/env');

// Dummy user data
const dummyUsers = [
    // Top Male Players
    {
        name: 'John Smith',
        email: 'john.smith@example.com',
        googleId: 'google_john_smith',
        profilePicture: 'https://i.pravatar.cc/150?img=12',
        gender: 'male',
        phoneNumber: '+1234567001',
        gameType: 'right-hand',
        isProfileComplete: true,
        ranking: 95,
        totalWins: 48,
        totalLosses: 2,
        winPercentage: 96.0,
        weeklyWins: 8,
        weeklyLosses: 0,
    },
    {
        name: 'Michael Johnson',
        email: 'michael.j@example.com',
        googleId: 'google_michael_j',
        profilePicture: 'https://i.pravatar.cc/150?img=13',
        gender: 'male',
        phoneNumber: '+1234567002',
        gameType: 'left-hand',
        isProfileComplete: true,
        ranking: 92,
        totalWins: 46,
        totalLosses: 4,
        winPercentage: 92.0,
        weeklyWins: 7,
        weeklyLosses: 1,
    },
    {
        name: 'David Lee',
        email: 'david.lee@example.com',
        googleId: 'google_david_lee',
        profilePicture: 'https://i.pravatar.cc/150?img=14',
        gender: 'male',
        phoneNumber: '+1234567003',
        gameType: 'right-hand',
        isProfileComplete: true,
        ranking: 88,
        totalWins: 44,
        totalLosses: 6,
        winPercentage: 88.0,
        weeklyWins: 6,
        weeklyLosses: 1,
    },
    {
        name: 'Robert Chen',
        email: 'robert.chen@example.com',
        googleId: 'google_robert_chen',
        profilePicture: 'https://i.pravatar.cc/150?img=15',
        gender: 'male',
        phoneNumber: '+1234567004',
        gameType: 'right-hand',
        isProfileComplete: true,
        ranking: 85,
        totalWins: 42,
        totalLosses: 8,
        winPercentage: 84.0,
        weeklyWins: 5,
        weeklyLosses: 2,
    },
    {
        name: 'James Wilson',
        email: 'james.wilson@example.com',
        googleId: 'google_james_wilson',
        profilePicture: 'https://i.pravatar.cc/150?img=16',
        gender: 'male',
        phoneNumber: '+1234567005',
        gameType: 'left-hand',
        isProfileComplete: true,
        ranking: 82,
        totalWins: 40,
        totalLosses: 10,
        winPercentage: 80.0,
        weeklyWins: 5,
        weeklyLosses: 2,
    },
    {
        name: 'Daniel Martinez',
        email: 'daniel.m@example.com',
        googleId: 'google_daniel_m',
        profilePicture: 'https://i.pravatar.cc/150?img=17',
        gender: 'male',
        phoneNumber: '+1234567006',
        gameType: 'right-hand',
        isProfileComplete: true,
        ranking: 78,
        totalWins: 38,
        totalLosses: 12,
        winPercentage: 76.0,
        weeklyWins: 4,
        weeklyLosses: 2,
    },
    {
        name: 'Christopher Brown',
        email: 'chris.brown@example.com',
        googleId: 'google_chris_brown',
        profilePicture: 'https://i.pravatar.cc/150?img=18',
        gender: 'male',
        phoneNumber: '+1234567007',
        gameType: 'right-hand',
        isProfileComplete: true,
        ranking: 75,
        totalWins: 36,
        totalLosses: 14,
        winPercentage: 72.0,
        weeklyWins: 4,
        weeklyLosses: 3,
    },
    {
        name: 'Matthew Taylor',
        email: 'matthew.t@example.com',
        googleId: 'google_matthew_t',
        profilePicture: 'https://i.pravatar.cc/150?img=19',
        gender: 'male',
        phoneNumber: '+1234567008',
        gameType: 'left-hand',
        isProfileComplete: true,
        ranking: 72,
        totalWins: 34,
        totalLosses: 16,
        winPercentage: 68.0,
        weeklyWins: 3,
        weeklyLosses: 3,
    },

    // Top Female Players
    {
        name: 'Sarah Williams',
        email: 'sarah.w@example.com',
        googleId: 'google_sarah_w',
        profilePicture: 'https://i.pravatar.cc/150?img=5',
        gender: 'female',
        phoneNumber: '+1234567101',
        gameType: 'right-hand',
        isProfileComplete: true,
        ranking: 94,
        totalWins: 47,
        totalLosses: 3,
        winPercentage: 94.0,
        weeklyWins: 8,
        weeklyLosses: 0,
    },
    {
        name: 'Emma Davis',
        email: 'emma.davis@example.com',
        googleId: 'google_emma_davis',
        profilePicture: 'https://i.pravatar.cc/150?img=9',
        gender: 'female',
        phoneNumber: '+1234567102',
        gameType: 'left-hand',
        isProfileComplete: true,
        ranking: 90,
        totalWins: 45,
        totalLosses: 5,
        winPercentage: 90.0,
        weeklyWins: 7,
        weeklyLosses: 1,
    },
    {
        name: 'Olivia Anderson',
        email: 'olivia.a@example.com',
        googleId: 'google_olivia_a',
        profilePicture: 'https://i.pravatar.cc/150?img=10',
        gender: 'female',
        phoneNumber: '+1234567103',
        gameType: 'right-hand',
        isProfileComplete: true,
        ranking: 86,
        totalWins: 43,
        totalLosses: 7,
        winPercentage: 86.0,
        weeklyWins: 6,
        weeklyLosses: 1,
    },
    {
        name: 'Sophia Garcia',
        email: 'sophia.g@example.com',
        googleId: 'google_sophia_g',
        profilePicture: 'https://i.pravatar.cc/150?img=20',
        gender: 'female',
        phoneNumber: '+1234567104',
        gameType: 'right-hand',
        isProfileComplete: true,
        ranking: 83,
        totalWins: 41,
        totalLosses: 9,
        winPercentage: 82.0,
        weeklyWins: 5,
        weeklyLosses: 2,
    },
    {
        name: 'Isabella Martinez',
        email: 'isabella.m@example.com',
        googleId: 'google_isabella_m',
        profilePicture: 'https://i.pravatar.cc/150?img=21',
        gender: 'female',
        phoneNumber: '+1234567105',
        gameType: 'left-hand',
        isProfileComplete: true,
        ranking: 80,
        totalWins: 39,
        totalLosses: 11,
        winPercentage: 78.0,
        weeklyWins: 5,
        weeklyLosses: 2,
    },
    {
        name: 'Mia Rodriguez',
        email: 'mia.r@example.com',
        googleId: 'google_mia_r',
        profilePicture: 'https://i.pravatar.cc/150?img=22',
        gender: 'female',
        phoneNumber: '+1234567106',
        gameType: 'right-hand',
        isProfileComplete: true,
        ranking: 76,
        totalWins: 37,
        totalLosses: 13,
        winPercentage: 74.0,
        weeklyWins: 4,
        weeklyLosses: 2,
    },
    {
        name: 'Charlotte Wilson',
        email: 'charlotte.w@example.com',
        googleId: 'google_charlotte_w',
        profilePicture: 'https://i.pravatar.cc/150?img=23',
        gender: 'female',
        phoneNumber: '+1234567107',
        gameType: 'right-hand',
        isProfileComplete: true,
        ranking: 73,
        totalWins: 35,
        totalLosses: 15,
        winPercentage: 70.0,
        weeklyWins: 4,
        weeklyLosses: 3,
    },
    {
        name: 'Amelia Thompson',
        email: 'amelia.t@example.com',
        googleId: 'google_amelia_t',
        profilePicture: 'https://i.pravatar.cc/150?img=24',
        gender: 'female',
        phoneNumber: '+1234567108',
        gameType: 'left-hand',
        isProfileComplete: true,
        ranking: 70,
        totalWins: 33,
        totalLosses: 17,
        winPercentage: 66.0,
        weeklyWins: 3,
        weeklyLosses: 3,
    },

    // Mid-tier Players (Mixed)
    {
        name: 'Ethan Moore',
        email: 'ethan.m@example.com',
        googleId: 'google_ethan_m',
        profilePicture: 'https://i.pravatar.cc/150?img=25',
        gender: 'male',
        phoneNumber: '+1234567009',
        gameType: 'right-hand',
        isProfileComplete: true,
        ranking: 68,
        totalWins: 31,
        totalLosses: 19,
        winPercentage: 62.0,
        weeklyWins: 3,
        weeklyLosses: 4,
    },
    {
        name: 'Ava Jackson',
        email: 'ava.j@example.com',
        googleId: 'google_ava_j',
        profilePicture: 'https://i.pravatar.cc/150?img=26',
        gender: 'female',
        phoneNumber: '+1234567109',
        gameType: 'right-hand',
        isProfileComplete: true,
        ranking: 65,
        totalWins: 29,
        totalLosses: 21,
        winPercentage: 58.0,
        weeklyWins: 2,
        weeklyLosses: 4,
    },
    {
        name: 'Alexander White',
        email: 'alex.white@example.com',
        googleId: 'google_alex_white',
        profilePicture: 'https://i.pravatar.cc/150?img=27',
        gender: 'male',
        phoneNumber: '+1234567010',
        gameType: 'left-hand',
        isProfileComplete: true,
        ranking: 62,
        totalWins: 27,
        totalLosses: 23,
        winPercentage: 54.0,
        weeklyWins: 2,
        weeklyLosses: 4,
    },
    {
        name: 'Harper Harris',
        email: 'harper.h@example.com',
        googleId: 'google_harper_h',
        profilePicture: 'https://i.pravatar.cc/150?img=28',
        gender: 'female',
        phoneNumber: '+1234567110',
        gameType: 'right-hand',
        isProfileComplete: true,
        ranking: 60,
        totalWins: 25,
        totalLosses: 25,
        winPercentage: 50.0,
        weeklyWins: 2,
        weeklyLosses: 5,
    },
];

async function seedLeaderboard() {
    try {
        // Connect to MongoDB
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing users (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing users...');
        await User.deleteMany({});
        console.log('✅ Existing users cleared');

        // Insert dummy users
        console.log('📝 Inserting dummy users...');
        const insertedUsers = await User.insertMany(dummyUsers);
        console.log(`✅ Successfully inserted ${insertedUsers.length} users`);

        // Display summary
        console.log('\n📊 Summary:');
        const maleCount = insertedUsers.filter(u => u.gender === 'male').length;
        const femaleCount = insertedUsers.filter(u => u.gender === 'female').length;
        console.log(`   - Male players: ${maleCount}`);
        console.log(`   - Female players: ${femaleCount}`);
        console.log(`   - Total players: ${insertedUsers.length}`);

        // Display top 3 overall
        const top3 = insertedUsers.sort((a, b) => b.ranking - a.ranking).slice(0, 3);
        console.log('\n🏆 Top 3 Players:');
        top3.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.name} (${user.gender}) - ${user.ranking} pts`);
        });

        console.log('\n✅ Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedLeaderboard();
