import app from './app.js';
import { connectDB, disconnectDB } from './config/database.js';
import env from './config/environment.js';

const PORT = env.port;

/**
 * Start the server
 */
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start Express server
        const server = app.listen(PORT, () => {
            console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🎬 MovieMania API Server                               ║
║                                                          ║
║   Environment: ${env.nodeEnv.padEnd(40)}║
║   Port: ${PORT.toString().padEnd(47)}║
║   API: http://localhost:${PORT}/api${' '.repeat(27)}║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
      `);
        });

        // Graceful shutdown
        const shutdown = async (signal) => {
            console.log(`\n${signal} received. Shutting down gracefully...`);

            server.close(async () => {
                console.log('HTTP server closed');
                await disconnectDB();
                process.exit(0);
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                console.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
