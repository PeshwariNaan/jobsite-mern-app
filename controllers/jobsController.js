import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js';
import checkPermissions from '../utils/checkPermissions.js';
import Job from '../models/jobModel.js';

export const createJob = async (req, res) => {
  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequestError('Please provide all values.');
  }

  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

export const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });

  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 });
};

export const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;
  if (!company || !position) {
    throw new BadRequestError('Please provide all values.');
  }

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`There is no job ID: ${jobId}`);
  }

  // Check permissions -
  // console.log(typeof req.user.userId);  //THis is a string
  // console.log(typeof job.createdBy);  //THis is a object

  checkPermissions(req.user, job.createdBy);

  // This was the first option for updating - this approach doesn't trigger hooks in the Model
  const updatedJob = await Job.findByIdAndUpdate({ _id: jobId }, req.body, {
    new: true, // This option returns updated job with the changed values
    runValidators: true,
  });

  //Second approach - This will trigger the hooks. You have to pull out all values that will be updated. But the catch is that if I don't add all values such as the job location
  // Then it will throw a validation error if that value is required.
  // job.position = position;
  // job.company = company;
  // job.jobLocation = jobLocation;
  // await job.save();

  res.status(StatusCodes.OK).json({ updatedJob });
};

export const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`There is no job with ID: ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  await job.remove();
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Success! Job has been successfully removed.' }); //This msg is only seen on postman
};

export const showStats = async (req, res) => {
  res.send('Show stats');
};
