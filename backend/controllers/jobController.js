import Job from '../models/Job.js';

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).populate('productId');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({ jobId: req.params.id }).populate('productId');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJobStatus = async (req, res) => {
  try {
    const job = await Job.findOne({ jobId: req.params.id });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ jobId: job.jobId, status: job.status, progress: job.progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};