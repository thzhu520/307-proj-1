import Report from '../models/Report.js';

// Create a new report
export const createReport = async (req, res) => {
  try {
    // Store the time in ISO 8601 format (using JavaScript Date object)
    const formattedTime = new Date(); // This will store the current time in ISO format

    // Create a new report with the formatted time
    const newReport = new Report({
      ...req.body,
      time: formattedTime, // Store the ISO 8601 date here
    });

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

  // Filter by title
  if (title) {
    const titleRegex = new RegExp(title, 'i'); // Case-insensitive match
    filter.title = titleRegex;
  }

  // Filter by location
  if (location) {
    filter.location = location;
  }

  // Filter by time range
  if (startTime || endTime) {
    const timeFilter = {};
    if (startTime) timeFilter.$gte = new Date(startTime);
    if (endTime) timeFilter.$lte = new Date(endTime);
    filter.time = timeFilter;
  }

  try {
    const reports = await Report.find(filter);

    // Format the time of each report before sending it back
    const formattedReports = reports.map(report => {
      // Format the time field without using Moment.js
      const date = new Date(report.time);
      const formattedTime = date.toLocaleString('en-US', {
        weekday: 'long', // Monday
        year: 'numeric', // 2024
        month: 'long', // November
        day: 'numeric', // 11
        hour: 'numeric', // 3 PM
        minute: 'numeric', // 45
        second: 'numeric', // 43
        hour12: true, // AM/PM
      });

      return {
        ...report.toObject(),
        time: formattedTime, // Send the formatted date string
      };
    });

    res.status(200).json(formattedReports); // Send the formatted reports
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve reports." });
  }
};
