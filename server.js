import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import { errorHandlerMiddleware } from './middleware/error-handler.js';
import { notFoundMiddleware } from './middleware/not-found.js';
const app = express();

dotenv.config();

//DB and authenticate user
import connectDB from './db/connect.js';

//routers
import authRouter from './routes/authRoutes.js';
import jobsRouter from './routes/jobRoutes.js';

app.use(express.json());
// Middleware
app.get('/', (req, res) => {
  res.send('Welcome!!');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

//app.listen(port, () => console.log(`Server is running on PORT ${port}...`));

const DB = process.env.MONGO_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const start = async () => {
  try {
    await connectDB(DB);
    app.listen(port, () => console.log(`Server is running on PORT ${port}...`));
  } catch (err) {
    console.log(err);
  }
};
start();