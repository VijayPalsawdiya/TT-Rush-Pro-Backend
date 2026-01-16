# Leaderboard Seed Script

This script populates MongoDB with dummy user data for testing the leaderboard functionality.

## Data Included

- **20 Total Users**
  - 8 Male players
  - 8 Female players  
  - 4 Mixed mid-tier players

## Stats Range

- **Ranking**: 60-95 points
- **Win Percentage**: 50%-96%
- **Total Matches**: 25-50 per player
- **Weekly Stats**: Included for weekly leaderboard

## Usage

### Run the seed script:

```bash
cd TTRushPro-backend
npm run seed:leaderboard
```

### What it does:

1. Connects to MongoDB
2. **Clears existing users** (⚠️ Warning: This deletes all users!)
3. Inserts 20 dummy users
4. Displays summary with top 3 players

## Output Example

```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB
🗑️  Clearing existing users...
✅ Existing users cleared
📝 Inserting dummy users...
✅ Successfully inserted 20 users

📊 Summary:
   - Male players: 8
   - Female players: 8
   - Total players: 20

🏆 Top 3 Players:
   1. John Smith (male) - 95 pts
   2. Sarah Williams (female) - 94 pts
   3. Michael Johnson (male) - 92 pts

✅ Seeding completed successfully!
```

## Test Cases Covered

### Singles - All
- Shows all 20 players sorted by ranking

### Singles - Male
- Shows 8 male players only

### Singles - Female
- Shows 8 female players only

### Doubles
- Shows all 20 players (pairs consecutive users)

## Customization

To keep existing users and add dummy data:

1. Open `src/scripts/seedLeaderboard.js`
2. Comment out this line:
   ```javascript
   // await User.deleteMany({});
   ```

## Note

⚠️ **Important**: This script uses `deleteMany({})` which will remove ALL users from the database. Make sure you're running this on a development database, not production!
