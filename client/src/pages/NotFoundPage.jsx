import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Film } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFoundPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                    <Film className="w-12 h-12 text-gray-400" />
                </div>

                <h1 className="text-6xl font-display font-bold text-gray-900 dark:text-white mb-4">
                    404
                </h1>

                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Page Not Found
                </h2>

                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    Oops! The page you're looking for doesn't exist. Maybe the movie was deleted,
                    or you followed a broken link.
                </p>

                <Link to="/">
                    <Button leftIcon={<Home className="w-5 h-5" />}>
                        Back to Home
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}
