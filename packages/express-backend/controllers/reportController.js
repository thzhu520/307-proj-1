import Report from '../models/Report.js';

// Function to create a new report
export const createReport = async (req, res) => {
  try {
    const newReport = new Report(req.body);
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ message: "Error creating report" });
  }
};

// Function to get all reports with formatted dates
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    const formattedReports = reports.map(report => {
      const date = new Date(report.createdDate);
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });

      return {
        ...report.toObject(),
        createdDate: `${formattedDate} at ${formattedTime}`
      };
    });

    res.json(formattedReports);
  } catch (error) {
    console.error("Error retrieving reports:", error);
    res.status(500).json({ message: "Error retrieving reports" });
  }
};
