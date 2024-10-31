import Report from '../models/Report.js';

// Create a new report
export const createReport = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // debug
    const report = new Report(req.body);
    await report.save();
    res.status(201).send(report);
  } catch (error) {
    console.error("Error:", error); // debug
    res.status(400).send(error);
  }
};

// Get all reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).send(reports);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error);
  }
};
