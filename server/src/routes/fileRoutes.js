// routes/fileRouter.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import upload from '../middleware/fileMiddleware.js';

const router = express.Router();
const uploadsDir = path.resolve('uploads');

router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully!', filename: req.file.filename });
});

router.get('/download/:filename', (req, res) => {
  const filepath = path.join(uploadsDir, req.params.filename);
  if (fs.existsSync(filepath)) {
    res.download(filepath);
  } else {
    res.status(404).send('File not found');
  }
});

export default router;