import express from 'express';
import { createReport, getReports } from '../controllers/reportController.js';

const router = express.Router();

// Define GET route for reports
router.get('/', getReports);

// Define POST route to create a new report
router.post('/', createReport);

export default router;