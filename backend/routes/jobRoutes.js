import express from 'express';
import { getAllJobs, getJobById, getJobStatus } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.get('/:id/status', getJobStatus);

export default router;