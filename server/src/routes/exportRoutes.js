import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { exportMovies, getExportStats } from '../controllers/exportController.js';

const router = express.Router();

// All export routes require authentication
router.use(authenticate);

// GET /api/export/stats - Get export preview stats
router.get('/stats', getExportStats);

// GET /api/export - Export movies (format=json or format=csv)
router.get('/', exportMovies);

export default router;
