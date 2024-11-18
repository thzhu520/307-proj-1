import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import CORS

dotenv.config({ path: './.env' });
// console.log("Loaded environment variables:", process.env);
// console.log("MONGODB_URI:", process.env.MONGODB_URI);



const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON
app.use(bodyParser.json());

// Add CORS middleware
app.use(cors()); // Allow all origins (temporary solution)

// Optionally, you can restrict it to a specific origin:
// app.use(cors({
//   origin: "https://your-frontend-domain.com"
// }));

// Connect to MongoDB

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });


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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
