import express from 'express';
import multer from 'multer';
import { uploadVideo, uploadCSV } from '../controllers/uploadController.js';

const router = express.Router();
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }
});

router.post('/video', upload.single('video'), uploadVideo);
router.post('/csv', upload.single('csv'), uploadCSV);

export default router;
