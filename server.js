import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import morgan from 'morgan';
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

app.use(cors()); //Here we can set up an origin with a config variable but we will use a proxy
if (process.env.NODE_ENV === 'developement') {
  app.use(morgan('dev'));
}
app.use(express.json());

// Middleware
// app.get('/', (req, res) => { //Just a dummy route we use as we set things up
//   res.send('Welcome!!');
// });

app.get('/api/v1', (req, res) => {
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
