import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import reportRoutes from './routes/reportRoutes.js';

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for your frontend URL
app.use(cors({
    origin: 'https://sloutions-cugpega6c5efaba4.westus3-01.azurewebsites.net', // Frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Middleware for parsing JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use report routes
app.use('/reports', reportRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`REST API is listening on port ${PORT}`);
});