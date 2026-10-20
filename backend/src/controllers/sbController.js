import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { User, Job, Application, Resume, Notification, Message, Review } from '../models/sbModels.js';

const c = {};
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const clean = (u) => { const o = u.toObject ? u.toObject() : { ...u }; delete o.password; return o; };
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const list = (v) => (Array.isArray(v) ? v : String(v || '').split(',')).map((s) => String(s).trim()).filter(Boolean);
const lc = (arr = []) => arr.map((s) => String(s).trim().toLowerCase()).filter(Boolean);
const fail = (res, code, message) => res.status(code).json({ message });
const notify = (user, title, message, link = '') => Notification.create({ user, title, message, link }).catch(() => {});
const name = (u) => u.companyName || u.name;

/* ---------- middleware ---------- */
export const protect = async (req, res, next) => {
  try {
    const h = req.headers.authorization || '';
    if (!h.startsWith('Bearer ')) return fail(res, 401, 'Please log in to continue');
    const { id } = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(id).select('-password');
    if (!user) return fail(res, 401, 'This account no longer exists');
    req.user = user;
    next();
  } catch { fail(res, 401, 'Your session has expired. Please log in again'); }
};
export const optional = async (req, res, next) => {
  try {
    const h = req.headers.authorization || '';
    if (h.startsWith('Bearer ')) {
      const { id } = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
      req.user = await User.findById(id).select('-password');
    }
  } catch { /* guest */ }
  next();
};
export const authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : fail(res, 403, 'This action is not available for your account type');

/* ---------- 1. authentication ---------- */
c.register = async (req, res) => {
  const { role, name: n, email, password, ...rest } = req.body;
  if (!['student', 'employer'].includes(role)) return fail(res, 400, 'Choose a valid account type');
  if (!n || !email || !password) return fail(res, 400, 'Name, email and password are required');
  if (password.length < 6) return fail(res, 400, 'Password must be at least 6 characters');
  if (role === 'employer' && !rest.companyName) return fail(res, 400, 'Company name is required');
  if (await User.findOne({ email: email.toLowerCase() })) return fail(res, 409, 'This email is already registered');
  const allowed = role === 'student'
    ? ['college', 'degree', 'graduationYear', 'phone', 'location']
    : ['companyName', 'industry', 'companySize', 'website', 'phone', 'location'];
  const extra = Object.fromEntries(allowed.filter((k) => rest[k] !== undefined && rest[k] !== '').map((k) => [k, rest[k]]));
  const user = await User.create({ role, name: n, email, password: await bcrypt.hash(password, 10), ...extra });
  notify(user._id, 'Welcome to SkillBridge', 'Complete your profile to get discovered faster.', '/profile');
  res.status(201).json({ token: sign(user._id), user: clean(user) });
};

c.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.password))) return fail(res, 401, 'Incorrect email or password');
  res.json({ token: sign(user._id), user: clean(user) });
};

c.me = (req, res) => res.json(req.user);

c.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) return fail(res, 400, 'New password must be at least 6 characters');
  const user = await User.findById(req.user._id);
  if (!(await bcrypt.compare(currentPassword || '', user.password))) return fail(res, 400, 'Current password is incorrect');
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password updated' });
};

/* ---------- 2/3/12. profile, skills, portfolio ---------- */
const PROFILE_FIELDS = ['name', 'phone', 'location', 'bio', 'avatar', 'college', 'degree', 'graduationYear', 'headline',
  'links', 'companyName', 'industry', 'companySize', 'website', 'about', 'settings'];

c.updateProfile = async (req, res) => {
  const upd = {};
  PROFILE_FIELDS.forEach((k) => { if (req.body[k] !== undefined) upd[k] = req.body[k]; });
  const user = await User.findByIdAndUpdate(req.user._id, upd, { new: true, runValidators: true }).select('-password');
  res.json(user);
};

c.deleteAccount = async (req, res) => {
  const id = req.user._id;
  await Promise.all([
    Job.deleteMany({ employer: id }), Application.deleteMany({ $or: [{ student: id }, { employer: id }] }),
    Resume.deleteMany({ user: id }), Notification.deleteMany({ user: id }),
    Message.deleteMany({ $or: [{ sender: id }, { receiver: id }] }), Review.deleteMany({ $or: [{ from: id }, { to: id }] }),
    User.findByIdAndDelete(id),
  ]);
  res.json({ message: 'Account deleted' });
};

c.updateSkills = async (req, res) => {
  const seen = new Set();
  const skills = (req.body.skills || [])
    .filter((s) => s && s.name && !seen.has(s.name.trim().toLowerCase()) && seen.add(s.name.trim().toLowerCase()))
    .map((s) => ({ name: s.name.trim(), level: ['Beginner', 'Intermediate', 'Advanced'].includes(s.level) ? s.level : 'Beginner' }));
  const user = await User.findByIdAndUpdate(req.user._id, { skills }, { new: true }).select('-password');
  res.json(user.skills);
};

c.addPortfolio = async (req, res) => {
  const { title, description, link, tech } = req.body;
  if (!title) return fail(res, 400, 'Project title is required');
  const u = await User.findById(req.user._id);
  u.portfolio.push({ title, description, link, tech: list(tech) });
  await u.save();
  res.status(201).json(u.portfolio);
};

c.updatePortfolio = async (req, res) => {
  const u = await User.findById(req.user._id);
  const item = u.portfolio.id(req.params.pid);
  if (!item) return fail(res, 404, 'Portfolio item not found');
  ['title', 'description', 'link'].forEach((k) => { if (req.body[k] !== undefined) item[k] = req.body[k]; });
  if (req.body.tech !== undefined) item.tech = list(req.body.tech);
  await u.save();
  res.json(u.portfolio);
};

c.deletePortfolio = async (req, res) => {
  const u = await User.findById(req.user._id);
  const item = u.portfolio.id(req.params.pid);
  if (!item) return fail(res, 404, 'Portfolio item not found');
  item.deleteOne();
  await u.save();
  res.json(u.portfolio);
};

c.directory = async (req, res) => {
  const f = {};
  if (req.query.role) f.role = req.query.role;
  if (req.query.q) { const r = new RegExp(esc(req.query.q), 'i'); f.$or = [{ name: r }, { companyName: r }]; }
  f._id = { $ne: req.user._id };
  res.json(await User.find(f).select('name companyName role headline industry').limit(50));
};

c.publicProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -settings -email -phone');
  if (!user) return fail(res, 404, 'Profile not found');
  const reviews = await Review.find({ to: user._id }).populate('from', 'name companyName role').sort('-createdAt');
  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  const jobs = user.role === 'employer' ? await Job.find({ employer: user._id, status: 'open' }).sort('-createdAt') : [];
  res.json({ user, jobs, reviews, rating: { avg: Number(avg.toFixed(1)), count: reviews.length } });
};

/* ---------- 4/5/7. jobs & freelance projects ---------- */
const JOB_FIELDS = ['type', 'title', 'description', 'location', 'workMode', 'jobType', 'salary', 'duration', 'deadline', 'status'];
const pickJob = (b) => {
  const o = {};
  JOB_FIELDS.forEach((k) => { if (b[k] !== undefined && b[k] !== '') o[k] = b[k]; });
  ['requirements', 'skills'].forEach((k) => { if (b[k] !== undefined) o[k] = list(b[k]); });
  ['budget', 'openings'].forEach((k) => { if (b[k] !== undefined && b[k] !== '') o[k] = Number(b[k]); });
  return o;
};

c.createJob = async (req, res) => {
  if (!req.body.title || !req.body.description) return fail(res, 400, 'Title and description are required');
  const job = await Job.create({ ...pickJob(req.body), employer: req.user._id });
  res.status(201).json(job);
};

c.getJobs = async (req, res) => {
  const { q, type, location, workMode, jobType, skill } = req.query;
  const f = { status: 'open' };
  if (type) f.type = type;
  if (workMode) f.workMode = workMode;
  if (jobType) f.jobType = jobType;
  if (location) f.location = new RegExp(esc(location), 'i');
  if (skill) f.skills = new RegExp(`^${esc(skill)}$`, 'i');
  if (q) { const r = new RegExp(esc(q), 'i'); f.$or = [{ title: r }, { description: r }, { skills: r }, { location: r }]; }
res.json(
  await Job.find(f)
    .populate(
      'employer',
      'name companyName industry companySize website location about avatar'
    )
    .sort('-createdAt')
    .limit(100)
);};


c.getJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Check whether the ID is a valid MongoDB ObjectId
    if (!/^[a-f\d]{24}$/i.test(id)) {
      return fail(res, 400, 'Invalid job ID');
    }

    const job = await Job.findById(id).populate(
      'employer',
      'name companyName industry companySize website location about avatar'
    );

    if (!job) {
      return fail(res, 404, 'Opportunity not found');
    }

    const result = job.toObject();

    // Include the student's application status, if applicable
    if (req.user?.role === 'student') {
      const application = await Application.findOne({
        job: job._id,
        student: req.user._id,
      }).select('status');

      result.applied = application ? application.status : null;
    }

    return res.json(result);
  } catch (error) {
    console.error('Error fetching job:', error);
    return fail(res, 500, 'Unable to fetch this opportunity');
  }
};


c.myJobs = async (req, res) => {
  const jobs = await Job.find({ employer: req.user._id }).sort('-createdAt').lean();
  const counts = await Application.aggregate([{ $match: { employer: req.user._id } }, { $group: { _id: '$job', n: { $sum: 1 } } }]);
  const map = Object.fromEntries(counts.map((x) => [String(x._id), x.n]));
  res.json(jobs.map((j) => ({ ...j, applicants: map[String(j._id)] || 0 })));
};

c.updateJob = async (req, res) => {
  const job = await Job.findOneAndUpdate({ _id: req.params.id, employer: req.user._id }, pickJob(req.body), { new: true, runValidators: true });
  if (!job) return fail(res, 404, 'Posting not found');
  res.json(job);
};

c.deleteJob = async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user._id });
  if (!job) return fail(res, 404, 'Posting not found');
  await Application.deleteMany({ job: job._id });
  res.json({ message: 'Posting deleted' });
};

/* ---------- 6/13. applications ---------- */
c.apply = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job || job.status !== 'open') return fail(res, 404, 'This opportunity is no longer open');
  if (await Application.findOne({ job: job._id, student: req.user._id })) return fail(res, 409, 'You have already applied');
  const app = await Application.create({
    job: job._id, student: req.user._id, employer: job.employer,
    resume: req.body.resume || undefined, coverLetter: req.body.coverLetter,
  });
notify(
  job.employer,
  'New application',
  `${req.user.name} applied for ${job.title}`,
  `/employer/applicants?applicationId=${app._id}`
);
  res.status(201).json(app);
};

c.myApplications = async (req, res) => {
  res.json(await Application.find({ student: req.user._id })
    .populate({ path: 'job', select: 'title type location budget salary employer', populate: { path: 'employer', select: 'name companyName' } })
    .populate('resume', 'title').sort('-createdAt'));
};

c.withdraw = async (req, res) => {
  const app = await Application.findOne({ _id: req.params.id, student: req.user._id }).populate('job', 'title');
  if (!app) return fail(res, 404, 'Application not found');
  if (!['Applied', 'Shortlisted'].includes(app.status)) return fail(res, 400, 'This application can no longer be withdrawn');
  app.status = 'Withdrawn';
  await app.save();
  notify(app.employer, 'Application withdrawn', `${req.user.name} withdrew from ${app.job.title}`, '/employer/applicants');
  res.json(app);
};

c.employerApplications = async (req, res) => {
  const f = { employer: req.user._id };
  if (req.query.job) f.job = req.query.job;
  if (req.query.status) f.status = req.query.status;
  res.json(await Application.find(f)
    .populate('student', 'name email phone college degree headline skills links portfolio')
    .populate('job', 'title type').populate('resume').sort('-createdAt'));
};

const ownApp = async (req, res) => {
  const app = await Application.findOne({ _id: req.params.id, employer: req.user._id }).populate('job', 'title');
  if (!app) fail(res, 404, 'Application not found');
  return app;
};

c.updateStatus = async (req, res) => {
  const app = await ownApp(req, res); if (!app) return;
  if (!['Shortlisted', 'Interview', 'Accepted', 'Rejected', 'Completed'].includes(req.body.status)) return fail(res, 400, 'Invalid status');
  app.status = req.body.status;
  await app.save();
  notify(app.student, `Application ${app.status.toLowerCase()}`, `${name(req.user)} marked your application for ${app.job.title} as ${app.status}.`, '/applications');
  res.json(app);
};

c.schedule = async (req, res) => {
  const app = await ownApp(req, res); if (!app) return;
  const { date, mode, link, notes } = req.body;
  if (!date) return fail(res, 400, 'Interview date and time are required');
  app.interview = { date, mode: mode || 'Online', link, notes };
  app.status = 'Interview';
  await app.save();
  notify(app.student, 'Interview scheduled', `${name(req.user)} scheduled an interview for ${app.job.title} on ${new Date(date).toLocaleString('en-IN')}.`, '/interviews');
  res.json(app);
};

c.progress = async (req, res) => {
  const app = await ownApp(req, res); if (!app) return;
  if (!['Accepted', 'Completed'].includes(app.status)) return fail(res, 400, 'Work progress can be tracked only for accepted applicants');
  const progress = Math.max(0, Math.min(100, Number(req.body.progress) || 0));
  app.progress = progress;
  app.updates.push({ note: req.body.note || '', progress });
  app.status = progress === 100 ? 'Completed' : 'Accepted';
  await app.save();
  notify(app.student, 'Work progress updated', `${app.job.title} is now ${progress}% complete.`, '/applications');
  res.json(app);
};

/* ---------- 10/11. resumes ---------- */
c.listResumes = async (req, res) => res.json(await Resume.find({ user: req.user._id }).sort('-updatedAt'));

c.createResume = async (req, res) => {
  if (!req.body.title) return fail(res, 400, 'Resume title is required');
  const first = !(await Resume.exists({ user: req.user._id }));
  const isDefault = first || !!req.body.isDefault;
  if (isDefault) await Resume.updateMany({ user: req.user._id }, { isDefault: false });
  res.status(201).json(await Resume.create({ user: req.user._id, title: req.body.title, data: req.body.data || {}, isDefault }));
};

c.getResume = async (req, res) => {
  const r = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  r ? res.json(r) : fail(res, 404, 'Resume not found');
};

c.updateResume = async (req, res) => {
  const r = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!r) return fail(res, 404, 'Resume not found');
  if (req.body.title) r.title = req.body.title;
  if (req.body.data) r.data = req.body.data;
  if (req.body.isDefault) { await Resume.updateMany({ user: req.user._id }, { isDefault: false }); r.isDefault = true; }
  await r.save();
  res.json(r);
};

c.deleteResume = async (req, res) => {
  const r = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!r) return fail(res, 404, 'Resume not found');
  if (r.isDefault) await Resume.findOneAndUpdate({ user: req.user._id }, { isDefault: true }, { sort: '-updatedAt' });
  res.json({ message: 'Resume deleted' });
};

/* ---------- 8/9/19. recommendations, skill gap, trending ---------- */
c.recommendations = async (req, res) => {
  const mine = new Set(lc(req.user.skills.map((s) => s.name)));
  const applied = (await Application.find({ student: req.user._id }).select('job')).map((a) => a.job);
  const jobs = await Job.find({ status: 'open', _id: { $nin: applied } }).populate('employer', 'name companyName').lean();
  const out = jobs.map((j) => {
    const need = lc(j.skills);
    const matched = need.filter((s) => mine.has(s));
    return { ...j, matchPercent: need.length ? Math.round((matched.length / need.length) * 100) : 0, matchedSkills: matched, missingSkills: need.filter((s) => !mine.has(s)) };
  }).filter((j) => j.matchPercent > 0).sort((a, b) => b.matchPercent - a.matchPercent).slice(0, 12);
  res.json(out);
};
c.uploadResume = async (req, res) => {
  if (!req.file) {
    return fail(res, 400, 'Please select a PDF, DOC, or DOCX file');
  }

  const title = String(req.body.title || req.file.originalname)
    .trim()
    .slice(0, 150);

  const first = !(await Resume.exists({ user: req.user._id }));
  const isDefault = first || req.body.isDefault === 'true';

  if (isDefault) {
    await Resume.updateMany(
      { user: req.user._id },
      { isDefault: false }
    );
  }

  try {
    const resume = await Resume.create({
      user: req.user._id,
      title,
      isDefault,
      file: {
        storedName: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });

    return res.status(201).json(resume);
  } catch (error) {
    await fs.promises.unlink(req.file.path).catch(() => {});
    throw error;
  }
};

c.downloadResumeFile = async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume || !resume.file?.storedName) {
    return fail(res, 404, 'Uploaded resume file not found');
  }

  const isOwner = String(resume.user) === String(req.user._id);

  // Employers may access a resume only if it was attached
  // to an application received by that employer.
  const isEmployer = req.user.role === 'employer'
    ? !!(await Application.exists({
        employer: req.user._id,
        resume: resume._id,
      }))
    : false;

  if (!isOwner && !isEmployer) {
    return fail(res, 403, 'You do not have permission to access this resume');
  }

  const filePath = path.resolve(
    process.cwd(),
    'uploads',
    'resumes',
    resume.file.storedName
  );

  if (!fs.existsSync(filePath)) {
    return fail(res, 404, 'Resume file is missing from server storage');
  }

  return res.download(filePath, resume.file.originalName);
};
const ROLE_SKILLS = {
  'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Responsive Design', 'TypeScript', 'Tailwind CSS'],
  'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'SQL', 'REST APIs', 'Git', 'Authentication', 'Docker'],
  'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Git', 'REST APIs'],
  'Data Analyst': ['Excel', 'SQL', 'Python', 'Statistics', 'Power BI', 'Data Visualization', 'Tableau'],
  'Data Scientist': ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Pandas', 'TensorFlow', 'Data Visualization'],
  'UI/UX Designer': ['Figma', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems', 'Adobe XD', 'Typography'],
  'Digital Marketer': ['SEO', 'Content Marketing', 'Google Analytics', 'Social Media Marketing', 'Email Marketing', 'Copywriting'],
  'Mobile App Developer': ['React Native', 'JavaScript', 'Flutter', 'Firebase', 'REST APIs', 'Git', 'Dart'],
  'DevOps Engineer': ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Git', 'Terraform'],
  'Content Writer': ['Copywriting', 'SEO', 'Research', 'Editing', 'Content Strategy', 'Storytelling'],
};

c.skillGapRoles = (req, res) => res.json(Object.keys(ROLE_SKILLS));

c.skillGap = async (req, res) => {
  let target, required;
  if (req.query.job) {
    const j = await Job.findById(req.query.job);
    if (!j) return fail(res, 404, 'Job not found');
    target = j.title; required = j.skills;
  } else if (ROLE_SKILLS[req.query.role]) {
    target = req.query.role; required = ROLE_SKILLS[target];
  } else return fail(res, 400, 'Choose a target role or job');
  const mine = new Set(lc(req.user.skills.map((s) => s.name)));
  const matched = required.filter((s) => mine.has(s.toLowerCase()));
  const missing = required.filter((s) => !mine.has(s.toLowerCase()));
  res.json({
    target, required, matched, missing,
    percent: required.length ? Math.round((matched.length / required.length) * 100) : 0,
    plan: missing.map((s, i) => ({ skill: s, step: `Weeks ${i * 2 + 1}-${i * 2 + 2}`, action: `Complete a structured ${s} course, then build one small project that demonstrates it.` })),
  });
};

const BASELINE = [
  ['Python', 'Programming', 92, 15], ['Machine Learning', 'AI', 90, 22], ['JavaScript', 'Programming', 88, 12],
  ['React', 'Frontend', 85, 14], ['SQL', 'Data', 84, 8], ['AWS', 'Cloud', 82, 18], ['TypeScript', 'Programming', 81, 20],
  ['Node.js', 'Backend', 80, 11], ['Prompt Engineering', 'AI', 79, 30], ['Git', 'Tools', 78, 5], ['Cybersecurity', 'Security', 77, 19],
  ['Docker', 'DevOps', 76, 16], ['Figma', 'Design', 74, 13], ['Data Visualization', 'Data', 72, 10], ['MongoDB', 'Database', 70, 9],
  ['Power BI', 'Data', 68, 12], ['Flutter', 'Mobile', 66, 13], ['SEO', 'Marketing', 64, 7],
];

c.trending = async (req, res) => {
  const agg = await Job.aggregate([{ $match: { status: 'open' } }, { $unwind: '$skills' }, { $group: { _id: { $toLower: '$skills' }, count: { $sum: 1 } } }]);
  const live = Object.fromEntries(agg.map((a) => [a._id, a.count]));
  const base = BASELINE.map(([n, category, demand, growth]) => ({ name: n, category, demand, growth, openings: live[n.toLowerCase()] || 0 }));
  const known = new Set(base.map((b) => b.name.toLowerCase()));
  const extra = agg.filter((a) => !known.has(a._id)).map((a) => ({ name: a._id.replace(/\b\w/g, (l) => l.toUpperCase()), category: 'Emerging', demand: 50, growth: 0, openings: a.count }));
  res.json([...base, ...extra].map((s) => ({ ...s, score: s.demand + Math.min(s.openings * 3, 30) })).sort((a, b) => b.score - a.score).slice(0, 20));
};

/* ---------- dashboards ---------- */
c.dashboard = async (req, res) => {
  const unread = await Notification.countDocuments({ user: req.user._id, read: false });
  const tally = (arr) => arr.reduce((m, a) => ({ ...m, [a.status]: (m[a.status] || 0) + 1 }), {});
  if (req.user.role === 'student') {
    const apps = await Application.find({ student: req.user._id }).select('status');
    const u = req.user;
    const checks = [u.headline, u.bio, u.college, u.phone, u.skills.length, u.portfolio.length];
    return res.json({
      role: 'student', total: apps.length, byStatus: tally(apps), unread,
      completeness: Math.round((checks.filter(Boolean).length / checks.length) * 100),
      resumes: await Resume.countDocuments({ user: u._id }), skills: u.skills.length, projects: u.portfolio.length,
    });
  }
  const jobs = await Job.find({ employer: req.user._id }).select('status type');
  const apps = await Application.find({ employer: req.user._id }).select('status');
  res.json({
    role: 'employer', unread, applicants: apps.length, byStatus: tally(apps),
    jobs: jobs.filter((j) => j.type === 'job').length, projects: jobs.filter((j) => j.type === 'project').length,
    open: jobs.filter((j) => j.status === 'open').length,
  });
};

/* ---------- 14. notifications ---------- */
c.notifications = async (req, res) => res.json(await Notification.find({ user: req.user._id }).sort('-createdAt').limit(50));
c.readNotification = async (req, res) => res.json(await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { read: true }, { new: true }));
c.readAllNotifications = async (req, res) => { await Notification.updateMany({ user: req.user._id, read: false }, { read: true }); res.json({ message: 'All marked as read' }); };
c.deleteNotification = async (req, res) => { await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id }); res.json({ message: 'Deleted' }); };

/* ---------- 18. messages ---------- */
c.conversations = async (req, res) => {
  const me = String(req.user._id);
  const msgs = await Message.find({ $or: [{ sender: me }, { receiver: me }] }).sort('-createdAt').populate('sender receiver', 'name companyName role');
  const map = new Map();
  for (const m of msgs) {
    if (!m.sender || !m.receiver) continue;
    const other = String(m.sender._id) === me ? m.receiver : m.sender;
    const k = String(other._id);
    if (!map.has(k)) map.set(k, { user: other, last: m.text, at: m.createdAt, unread: 0 });
    if (String(m.receiver._id) === me && !m.read) map.get(k).unread++;
  }
  res.json([...map.values()]);
};

c.thread = async (req, res) => {
  const me = req.user._id, other = req.params.userId;
  const user = await User.findById(other).select('name companyName role');
  if (!user) return fail(res, 404, 'User not found');
  await Message.updateMany({ sender: other, receiver: me, read: false }, { read: true });
  const messages = await Message.find({ $or: [{ sender: me, receiver: other }, { sender: other, receiver: me }] }).sort('createdAt');
  res.json({ user, messages });
};

c.sendMessage = async (req, res) => {
  const { to, text } = req.body;
  if (!to || !text || !text.trim()) return fail(res, 400, 'Recipient and message are required');
  if (!(await User.exists({ _id: to }))) return fail(res, 404, 'Recipient not found');
  const m = await Message.create({ sender: req.user._id, receiver: to, text: text.trim() });
  notify(to, 'New message', `${name(req.user)} sent you a message.`, `/messages?to=${req.user._id}`);
  res.status(201).json(m);
};

c.updateMessage = async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return fail(res, 400, 'Message cannot be empty');
  }

  const message = await Message.findOne({
    _id: req.params.messageId,
    sender: req.user._id,
  });

  if (!message) {
    return fail(res, 404, 'Message not found or you cannot edit it');
  }

  message.text = text.trim();
  await message.save();

  res.json(message);
};

c.deleteMessage = async (req, res) => {
  const message = await Message.findOneAndDelete({
    _id: req.params.messageId,
    sender: req.user._id,
  });

  if (!message) {
    return fail(res, 404, 'Message not found or you cannot delete it');
  }

  res.json({ message: 'Message deleted successfully' });
};


/* ---------- 15. reviews ---------- */
c.listReviews = async (req, res) => res.json(await Review.find().populate('from to', 'name companyName role').sort('-createdAt').limit(100));

c.createReview = async (req, res) => {
  const { to, rating, comment } = req.body;
  if (!to || !rating || !comment) return fail(res, 400, 'Select a person, a rating and write a comment');
  if (String(to) === String(req.user._id)) return fail(res, 400, 'You cannot review yourself');
  if (!(await User.exists({ _id: to }))) return fail(res, 404, 'User not found');
  const r = await Review.findOneAndUpdate({ from: req.user._id, to }, { rating: Number(rating), comment }, { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true });
  notify(to, 'New review', `${name(req.user)} left you a ${rating}-star review.`, '/reviews');
  res.status(201).json(r);
};

c.deleteReview = async (req, res) => {
  const r = await Review.findOneAndDelete({ _id: req.params.id, from: req.user._id });
  r ? res.json({ message: 'Review deleted' }) : fail(res, 404, 'Review not found');
};

/* wrap async handlers so errors reach the error middleware */
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export default Object.fromEntries(Object.entries(c).map(([k, f]) => [k, wrap(f)]));
