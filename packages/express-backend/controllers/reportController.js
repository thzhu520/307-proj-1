import Report from '../models/Report.js';

// Create a new report
export const createReport = async (req, res) => {
  try {
    const newReport = new Report(req.body);
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: "Failed to create report." });
  }
};

// Get all reports (with optional filters)
export const getReports = async (req, res) => {
  const { title, location, startTime, endTime } = req.query;
  const filter = {};

  if (title) {
    const titleRegex = new RegExp(title, 'i'); // Case-insensitive match
    filter.title = titleRegex;
  }

  if (location) {
    filter.location = location;
  }

  if (startTime || endTime) {
    const timeFilter = {};
    if (startTime) timeFilter.$gte = new Date(startTime);
    if (endTime) timeFilter.$lte = new Date(endTime);
    filter.time = timeFilter;
  }

  try {
    const reports = await Report.find(filter);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve reports." });
  }
};


