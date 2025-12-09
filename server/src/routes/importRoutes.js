import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { importMovies, getImportFormats } from '../controllers/importController.js';

const router = express.Router();

// GET /api/import/formats - Get supported import formats (public)
router.get('/formats', getImportFormats);

// POST /api/import - Import movies from CSV (requires auth)
router.post('/', authenticate, importMovies);

export default router;
