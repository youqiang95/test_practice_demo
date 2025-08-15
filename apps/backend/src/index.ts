import express from 'express';
import apiRouter from './routes';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use('/api/v1', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
