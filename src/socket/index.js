const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

let io;

/**
 * Initialize Socket.IO server
 */
const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*', // Update with your frontend URL in production
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (error) {
            return next(new Error('Authentication error: Invalid token'));
        }
    });

    // Connection handling
    io.on('connection', (socket) => {
        console.log(`✅ User connected: ${socket.userId}`);

        // Join user-specific room
        socket.join(`user:${socket.userId}`);

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.userId}`);
        });
    });

    console.log('🔌 Socket.IO initialized');
    return io;
};

/**
 * Get Socket.IO instance
 */
const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
};

/**
 * Emit event to specific user
 */
const emitToUser = (userId, event, data) => {
    if (!io) {
        console.warn('Socket.IO not initialized, skipping emit');
        return;
    }

    io.to(`user:${userId}`).emit(event, data);
    console.log(`📤 Emitted ${event} to user ${userId}`);
};

/**
 * Emit event to multiple users
 */
const emitToUsers = (userIds, event, data) => {
    if (!io) {
        console.warn('Socket.IO not initialized, skipping emit');
        return;
    }

    userIds.forEach(userId => {
        io.to(`user:${userId}`).emit(event, data);
    });
    console.log(`📤 Emitted ${event} to ${userIds.length} users`);
};

module.exports = {
    initializeSocket,
    getIO,
    emitToUser,
    emitToUsers,
};
