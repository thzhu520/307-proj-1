import moment from 'moment';
import Report from '../models/Report.js';

// Create a new report
export const createReport = async (req, res) => {
  try {
    // Format the current time before saving
    const formattedTime = moment().format("dddd, MMMM Do YYYY [at] h:mm:ss A");

    // Create a new report with the formatted time
    const newReport = new Report({
      ...req.body,
      time: formattedTime, // Add the formatted time here
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
    const formattedReports = reports.map(report => ({
      ...report.toObject(),
      time: moment(report.time).format("dddd, MMMM Do YYYY [at] h:mm:ss A"), // Format the time field
    }));

    res.status(200).json(formattedReports); // Send the formatted reports
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve reports." });
  }
};
