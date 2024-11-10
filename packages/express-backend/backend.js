import express from 'express';
import connectDB from './db.js';
import reportRoutes from './routes/reportRoutes.js';
import cors from 'cors';
import Report from './models/Report.js';
import { filterByDateRange, filterByLocation } from './filters/reportFilters.js';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/reports', reportRoutes);

app.get("/reports", async (req, res) => {
  const { title, description, location, startDate, endDate } = req.query;
  const filter = {};

  if (title) {
    const titleWords = title.trim().split(/\s+/); 
    const titleRegexPattern = titleWords.map(word => `(?=.*\\b${word}\\b)`).join(''); 
    filter.title = { $regex: new RegExp(titleRegexPattern, 'i') };
  }
  if (description) {
    const descriptionWords = description.trim().split(/\s+/); 
    const descriptionRegexPattern = descriptionWords.map(word => `(?=.*\\b${word}\\b)`).join(''); 
    filter.description = { $regex: new RegExp(descriptionRegexPattern, 'i') };
  }
  if (location) {
    filter.location = filterByLocation(location);
  }
  if (startDate || endDate) {
    filter.date = filterByDateRange(startDate, endDate);
  }

  try {
    const reports = await Report.find(filter);
    res.status(200).send(reports);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Failed to retrieve reports"});
    }
  });


connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});
