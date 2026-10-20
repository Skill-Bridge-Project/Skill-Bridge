import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import c, { protect, optional, authorize } from '../controllers/sbController.js';

const router = Router();
const S = authorize('student');
const E = authorize('employer');
const uploadDir = path.resolve(process.cwd(), 'uploads', 'resumes');
fs.mkdirSync(uploadDir, { recursive: true });

const allowedExtensions = new Set(['.pdf', '.doc', '.docx']);
const allowedMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const resumeUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowedExtensions.has(ext) && allowedMimeTypes.has(file.mimetype));
  },
});
router.post(
  '/resumes/upload',
  protect,
  S,
  resumeUpload.single('resume'),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        message: 'Choose a valid PDF, DOC, or DOCX file.',
      });
    }
    next();
  },
  c.uploadResume
);

router.get('/resumes/:id/file', protect, c.downloadResumeFile);

// auth
router.post('/auth/register', c.register);
router.post('/auth/login', c.login);
router.get('/auth/me', protect, c.me);
router.put('/auth/password', protect, c.changePassword);

// profile, skills, portfolio
router.put('/profile', protect, c.updateProfile);
router.delete('/profile', protect, c.deleteAccount);
router.put('/skills', protect, S, c.updateSkills);
router.post('/portfolio', protect, S, c.addPortfolio);
router.put('/portfolio/:pid', protect, S, c.updatePortfolio);
router.delete('/portfolio/:pid', protect, S, c.deletePortfolio);
router.get('/users', protect, c.directory);
router.get('/users/:id', c.publicProfile);

// jobs & freelance projects
router.get('/jobs', c.getJobs);
router.get('/jobs/mine', protect, E, c.myJobs);
router.get('/jobs/:id', optional, c.getJob);
router.post('/jobs', protect, E, c.createJob);
router.put('/jobs/:id', protect, E, c.updateJob);
router.delete('/jobs/:id', protect, E, c.deleteJob);

// applications
router.get('/applications/mine', protect, S, c.myApplications);
router.get('/applications/employer', protect, E, c.employerApplications);
router.post('/applications/:jobId', protect, S, c.apply);
router.put('/applications/:id/withdraw', protect, S, c.withdraw);
router.put('/applications/:id/status', protect, E, c.updateStatus);
router.put('/applications/:id/schedule', protect, E, c.schedule);
router.put('/applications/:id/progress', protect, E, c.progress);

// resumes
router.get('/resumes', protect, S, c.listResumes);
router.post('/resumes', protect, S, c.createResume);
router.get('/resumes/:id', protect, S, c.getResume);
router.put('/resumes/:id', protect, S, c.updateResume);
router.delete('/resumes/:id', protect, S, c.deleteResume);

// intelligence
router.get('/recommendations', protect, S, c.recommendations);
router.get('/skillgap/roles', c.skillGapRoles);
router.get('/skillgap', protect, S, c.skillGap);
router.get('/trending', c.trending);
router.get('/dashboard', protect, c.dashboard);

// notifications
router.get('/notifications', protect, c.notifications);
router.put('/notifications/read-all', protect, c.readAllNotifications);
router.put('/notifications/:id/read', protect, c.readNotification);
router.delete('/notifications/:id', protect, c.deleteNotification);

// messages
router.get('/messages', protect, c.conversations);
router.get('/messages/:userId', protect, c.thread);
router.post('/messages', protect, c.sendMessage);

// reviews
router.get('/reviews', c.listReviews);
router.post('/reviews', protect, c.createReview);
router.delete('/reviews/:id', protect, c.deleteReview);
router.put('/messages/:messageId', protect, c.updateMessage);
router.delete('/messages/:messageId', protect, c.deleteMessage);
export default router;
