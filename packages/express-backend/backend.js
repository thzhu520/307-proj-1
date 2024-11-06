import express from 'express';
import connectDB from './db.js';
import reportRoutes from './routes/reportRoutes.js';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/reports', reportRoutes);


connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});
