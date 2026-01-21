import express, { Application } from 'express';
import cors from 'cors';


const app: Application = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    credentials: true
}));

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use("/api/v1", router);

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Multi-tenant Organization API is running"
    })
});

// Error handling middleware
// app.use(notFound);
// app.use(globalErrorHandler);

export default app;
