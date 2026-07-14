import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import kamarRoutes from './routes/kamarRoutes.js';
import tamuRoutes from './routes/tamuRoutes.js';
import reservasiRoutes from './routes/reservasiRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/kamar', kamarRoutes);
app.use('/api/tamu', tamuRoutes);
app.use('/api/reservasi', reservasiRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
