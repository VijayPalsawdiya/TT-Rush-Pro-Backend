const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorMiddleware = require('./middlewares/error.middleware');
const routes = require('./routes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware (should be last)
app.use(errorMiddleware);

module.exports = app;
