import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
    getCollections,
    getCollection,
    createCollection,
    updateCollection,
    deleteCollection,
    addMovieToCollection,
    removeMovieFromCollection,
    reorderMovies,
    getMovieCollections,
    getTemplates
} from '../controllers/collectionController.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Template routes (must be before :id routes)
router.get('/templates', getTemplates);

// Get collections for a specific movie
router.get('/movie/:movieId', getMovieCollections);

// Collection CRUD
router.get('/', getCollections);
router.post('/', createCollection);
router.get('/:id', getCollection);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);

// Movie management within collections
router.post('/:id/movies', addMovieToCollection);
router.delete('/:id/movies/:movieId', removeMovieFromCollection);
router.put('/:id/reorder', reorderMovies);

export default router;
