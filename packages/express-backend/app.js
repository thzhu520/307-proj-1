import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly set the path to the .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Debugging: Check if MONGODB_URI is loaded
if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is undefined! Ensure the .env file is loaded correctly.");
    process.exit(1); // Exit the process if MONGODB_URI is not defined
}

// Debugging: Log the current MongoDB URI
// console.log("Connecting to MongoDB URI:", process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 8080; // Azure dynamically assigns the PORT

// Middleware to parse JSON
app.use(bodyParser.json());

// Add CORS middleware
app.use(cors()); // Allow all origins (temporary solution)

// Optionally, restrict it to a specific origin:
// app.use(cors({
//   origin: "https://your-frontend-domain.com"
// }));

// Lightweight health check endpoint for Azure
app.get('/health', (req, res) => {
    res.status(200).send('Healthy');
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { dbName: 'SLOutions' }) // Optional: explicitly specify dbName
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Define the report schema and model
const reportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    status: { type: String, default: "unresolved" },
});

const Report = mongoose.model("Report", reportSchema);

// Endpoint to receive the report data
app.post('/api/reports', async (req, res) => {
    try {
        const report = new Report(req.body);
        await report.save();
        res.status(201).json({ message: "Report submitted successfully!" });
    } catch (error) {
        console.error("Error submitting report:", error);
        res.status(500).json({ error: "Failed to submit report" });
    }
});

// Endpoint to fetch all reports (optional for testing)
app.get('/api/reports', async (req, res) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: "Failed to fetch reports" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
