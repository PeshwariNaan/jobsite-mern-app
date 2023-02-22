import mongoose from 'mongoose';
mongoose.set('strictQuery', false);

//   mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('DB connection successful');
//   });

const connectDB = (url) => {
  return mongoose.connect(url);
};
export default connectDB;
