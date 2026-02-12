import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApiResponseMiddleware, errorHandlerMiddleware } from './middlewares/index';
import { getEnvVariable } from '../utility/index';
import Router from './routes/index';

dotenv.config();

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(ApiResponseMiddleware);

app.use('/api', Router);

// Middleware d'erreur 
app.use(errorHandlerMiddleware);

const PORT = getEnvVariable('PORT') || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api/doc`);
});