# TT Rush Pro Backend

A Node.js backend API for the TT Rush Pro table tennis application.

## Features

- 🔐 Google OAuth Authentication
- 🔄 JWT with Auto-Refresh Tokens
- 📊 Ranking System
- 🏆 Weekly Challenges
- 🎮 Match Management
- 📈 Leaderboards
- 🔔 Push Notifications (FCM)
- ☁️ Image Upload (Cloudinary)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT, Google OAuth
- **File Upload**: Cloudinary
- **Push Notifications**: Firebase Cloud Messaging
- **Validation**: Joi

## Project Structure

```
src/
├── app.js                  # Express app setup
├── server.js               # App entry point
├── config/                 # App configurations
├── modules/                # Feature-based modules
│   ├── auth/
│   ├── users/
│   ├── challenges/
│   ├── matches/
│   ├── leaderboard/
│   ├── notifications/
│   ├── home/
│   └── stats/
├── middlewares/            # Global middlewares
├── utils/                  # Helper utilities
├── cron/                   # Cron jobs
└── constants/              # App constants
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google OAuth credentials
- Cloudinary account
- Firebase project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/fcm-token` - Update FCM token

### Challenges
- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/:id` - Get challenge by ID
- `POST /api/challenges` - Create new challenge

### Matches
- `POST /api/matches` - Create new match
- `GET /api/matches` - Get matches
- `PUT /api/matches/:id/result` - Update match result

### Leaderboard
- `GET /api/leaderboard` - Get overall leaderboard
- `GET /api/leaderboard/weekly` - Get weekly leaderboard

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `POST /api/notifications/send` - Send notification

### Home
- `GET /api/home` - Get home dashboard data

### Stats
- `GET /api/stats` - Get user statistics

## License

MIT
