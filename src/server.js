require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');
const { initializeSocket } = require('./socket');

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

// Initialize Socket.IO
initializeSocket(server);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});
