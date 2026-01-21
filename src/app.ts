import express, { Application } from 'express';
import cors from 'cors';
import { router } from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';


const app: Application = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    credentials: true
}));

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", router);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Multi-tenant Organization API is running"
    })
});

// Error handling middleware
// app.use(notFound);
app.use(globalErrorHandler);

export default app;
