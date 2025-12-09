import { Router } from 'express';
import authRoutes from './authRoutes.js';
import movieRoutes from './movieRoutes.js';
import tmdbRoutes from './tmdbRoutes.js';
import statsRoutes from './statsRoutes.js';
import watchlistRoutes from './watchlistRoutes.js';
import collectionRoutes from './collectionRoutes.js';
import exportRoutes from './exportRoutes.js';
import importRoutes from './importRoutes.js';

const router = Router();

// API health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'MovieMania API is running',
        timestamp: new Date().toISOString()
    });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/tmdb', tmdbRoutes);
router.use('/stats', statsRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/collections', collectionRoutes);
router.use('/export', exportRoutes);
router.use('/import', importRoutes);

export default router;
