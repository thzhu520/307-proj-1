
import express from 'express';
import { createReport, getReports } from '../controllers/reportController.js'; // Adjust path if needed

const router = express.Router();

// POST endpoint to create a report
router.post('/', createReport);

// GET endpoint to fetch all reports
router.get('/', getReports);

// get endpoint to filter reports by time
router.get('/time', async (req, res) => {
    const { title, location, startTime, endTime } = req.query;
  
    // Log the received parameters for debugging
    console.log("Received title:", title);
    console.log("Received location:", location);
    console.log("Received startTime:", startTime);
    console.log("Received endTime:", endTime);
  
    // Initialize filter object to hold query parameters
    const filter = {};
  
    // Handle title filtering if provided
    if (title) {
      const titleWords = title.trim().split(/\s+/);
      const titleRegexPattern = titleWords.map(word => `(?=.*\\b${word}\\b)`).join('');
      filter.title = { $regex: new RegExp(titleRegexPattern, 'i') };
    }
  
    // Handle location filtering if provided
    if (location) {
      filter.location = location;
    }
  
    // Handle time filtering if startTime and endTime are provided
    if (startTime || endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
  
      // Log the converted dates
      console.log("Converted start date:", start);
      console.log("Converted end date:", end);
  
      if (isNaN(start) || isNaN(end)) {
        return res.status(400).send({ error: "Invalid date format." });
      }
  
      // Add time filter to the filter object
      filter.time = { $gte: start, $lte: end };
    }
  
    // Check if any filter parameters are invalid
    if (Object.keys(filter).length === 0) {
      return res.status(400).send({ error: "At least one filter parameter (title, location, or time) is required." });
    }
  
    try {
      // Query the database with the filter object
      const reports = await Report.find(filter);
  
      // Return the results
      res.status(200).json(reports);
    } catch (error) {
      console.error("Error querying the database:", error);
      res.status(500).send({ error: "Failed to retrieve reports by time, title, or location." });
    }
  });
  

export default router;
