import mongoose from 'mongoose';
import validator from 'validator';

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide a company name.'],
      trim: true,
      maxlength: [50, 'Name must have less than or equal to 50 characters'],
    },
    position: {
      type: String,
      required: [true, 'Please provoide the position.'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'pending', 'declined'],
      default: 'pending',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'full-time',
    },
    jobLocation: {
      type: String,
      required: [true, 'Please provide a the job location.'],
      maxlength: [50, 'location must have less than or equal to 50 characters'],
      default: 'My city',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the user.'],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', JobSchema);

export default Job;
