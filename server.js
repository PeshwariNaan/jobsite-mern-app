import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';

import { errorHandlerMiddleware } from './middleware/error-handler.js';
import { notFoundMiddleware } from './middleware/not-found.js';

const app = express();

dotenv.config();

//DB and authenticate user
import connectDB from './db/connect.js';

//routers
import authRouter from './routes/authRoutes.js';
import jobsRouter from './routes/jobRoutes.js';
import authenticateUser from './middleware/auth.js';

app.use(cors()); //Here we can set up an origin with a config variable but we will use a proxy
if (process.env.NODE_ENV === 'developement') {
  app.use(morgan('dev'));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// Middleware

//******************** Simple checks as we set up server */
// app.get('/', (req, res) => { //Just a dummy route we use as we set things up
//   res.send('Welcome!!');
// });

// app.get('/api/v1', (req, res) => {
//   res.send('Welcome!!');
// });
/*************************** */

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);
// After these two routes have been tried then we move to all get routes below - **IMPORTANT

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

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
