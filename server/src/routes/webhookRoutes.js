import { Router } from 'express';
import { handlePlexWebhook, handleJellyfinWebhook } from '../controllers/webhookController.js';
import multer from 'multer';

const router = Router();
const upload = multer(); // Handle multipart/form-data for Plex

// Plex sends multipart form data
router.post('/plex', upload.none(), handlePlexWebhook);

// Jellyfin sends JSON
router.post('/jellyfin', handleJellyfinWebhook);

export default router;
