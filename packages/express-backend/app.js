import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });

// Serve static files from the 'frontend' directory located two levels up
app.use(express.static(path.join(path.resolve(), '..', '..', 'frontend')));

// Define the report schema and model
const reportSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    createdDate: Date,
    status: { type: String, default: "unresolved" }
});

const Report = mongoose.model("Report", reportSchema);

// Endpoint to receive the report data
app.post('/api/reports', async (req, res) => {
    try {
        const report = new Report(req.body);
        await report.save();
        res.status(201).json({ message: "Report submitted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit report" });
    }
});

// Catch-all route to serve index.html on the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(), '..', '..', 'frontend', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
