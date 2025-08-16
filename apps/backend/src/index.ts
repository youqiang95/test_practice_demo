import express from 'express';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';
import { checkDatabaseConnection } from './prisma';

const app = express();
const PORT = 3001;

async function startServer() {
  try {
    await checkDatabaseConnection();
    
    app.use(express.json());
    app.use('/api/v1', apiRouter);
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
