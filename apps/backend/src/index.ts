import express from 'express';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use('/api/v1', apiRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
