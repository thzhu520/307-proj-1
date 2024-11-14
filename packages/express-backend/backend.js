import express from 'express';
import cors from 'cors';
import connectDB from './db.js'; // Database connection file
import reportRoutes from './routes/reportroutes.js'; // Report routes

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use the report routes
app.use('/reports', reportRoutes); 

// Start the server
app.listen(PORT, () => {
  console.log(`REST API is listening on port ${PORT}`);
});
