import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import moment from 'moment';
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
  const { search, status, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  // Chain conditions based on selection
  if (status && status !== 'all') {
    queryObject.status = status;
  }
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }

  //NO AWAIT
  console.log(queryObject);
  let result = Job.find(queryObject);

  // Chain sort options
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'a-z') {
    result = result.sort('position');
  }
  if (sort === 'z-a') {
    result = result.sort('-position');
  }

  const jobs = await result;

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
  //  Using let so we can manipulate the stats variable with reduce below
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // without the reduce method below we are returned an array - the reduce method will yield an object instead
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  // Added some default values for new users and users that don't have all values - keeps the frontend from breaking
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: {
            $year: '$createdAt',
          },
          month: {
            $month: '$createdAt',
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      // in moment the months are counted from 0 -> 11 so we need to subtract 1 when using mongoDB
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
