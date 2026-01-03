import { Router } from 'express';
import authRoutes from './authRoutes.js';
import movieRoutes from './movieRoutes.js';
import tvShowRoutes from './tvShowRoutes.js';
import tmdbRoutes from './tmdbRoutes.js';
import statsRoutes from './statsRoutes.js';
import watchlistRoutes from './watchlistRoutes.js';
import watchlistTVRoutes from './watchlistTVRoutes.js';
import collectionRoutes from './collectionRoutes.js';
import exportRoutes from './exportRoutes.js';
import importRoutes from './importRoutes.js';
import recommendationRoutes from './recommendationRoutes.js';
import aiRoutes from './aiRoutes.js';
import integrationRoutes from './integrationRoutes.js';
import webhookRoutes from './webhookRoutes.js';
import episodeRoutes from './episodeRoutes.js';


const router = Router();

// API Health Check
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/tmdb', tmdbRoutes);
router.use('/movies', movieRoutes);
router.use('/tvshows', tvShowRoutes);
router.use('/stats', statsRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/watchlist-tv', watchlistTVRoutes);
router.use('/collections', collectionRoutes);
router.use('/export', exportRoutes);
router.use('/import', importRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/ai', aiRoutes);
router.use('/integrations', integrationRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/episodes', episodeRoutes);

export default router;
