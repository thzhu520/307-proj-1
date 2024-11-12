import express from 'express';
import cors from 'cors'; // Make sure cors is imported after express
import connectDB from './db.js'; // Your DB connection
import reportRoutes from './routes/reportroutes.js'; // Import report routes

// Initialize the Express app after importing the necessary packages
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors()); // Use CORS middleware before routes
app.use(express.json()); // to parse JSON request bodies

// Use the report routes
app.use('/reports', reportRoutes); 

// Connect to the database
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
