import app from './app';
import { config } from './config/env';
import { initDb } from './config/db';

const startServer = async () => {
  try {
    // Initialize database tables securely
    await initDb();

    app.listen(config.port, () => {
      console.log(`Server is running correctly on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
