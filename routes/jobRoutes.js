import express from 'express';
import {
  createJob,
  updateJob,
  showStats,
  deleteJob,
  getAllJobs,
} from '../controllers/jobsController.js';

const router = express.Router();

router.route('/').post(createJob).get(getAllJobs);
//Remeber about :id
router.route('/stats').get(showStats);
router.route('/:id').delete(deleteJob).patch(updateJob);

export default router;
