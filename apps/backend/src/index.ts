import express from 'express';
import { Request, Response } from 'express';

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
