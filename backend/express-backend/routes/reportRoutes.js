import express from 'express';
import { createReport, getReports } from '../controllers/reportController.js';

const router = express.Router();

// POST endpoint to create a report
router.post('/', createReport);

// GET endpoint to fetch all reports
router.get('/', getReports);

export default router;
