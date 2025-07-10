import express from 'express';
import cors from 'cors';
import transactionsRoute from './routes/transactionsRoute.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/transaction', transactionsRoute); // ✅ attaches /api/summary/:userId

app.listen(5001, () => {
  console.log('Server running on port 5001');
});
