import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import reportRoutes from './routes/reportRoutes.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/reports', reportRoutes);

app.listen(PORT, () => {
    console.log(`REST API is listening on port ${PORT}`);
});
