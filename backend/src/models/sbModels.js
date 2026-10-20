import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const ref = (name) => ({ type: Schema.Types.ObjectId, ref: name });

const userSchema = new Schema({
  role: { type: String, enum: ['student', 'employer'], required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: String, location: String, bio: String, avatar: String,
  // student fields
  college: String, degree: String, graduationYear: Number, headline: String,
  skills: [{ name: String, level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' } }],
  portfolio: [{
    title: { type: String, required: true }, description: String, link: String, tech: [String],
    createdAt: { type: Date, default: Date.now },
  }],
  links: { github: String, linkedin: String, website: String },
  // employer fields
  companyName: String, industry: String, companySize: String, website: String, about: String,
  settings: { emailNotifications: { type: Boolean, default: true } },
}, { timestamps: true });

// A job posting or a freelance project (type decides which)
const jobSchema = new Schema({
  employer: { ...ref('User'), required: true },
  type: { type: String, enum: ['job', 'project'], default: 'job' },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  requirements: [String],            // needs stated by the company
  skills: [String],
  location: String,
  workMode: { type: String, enum: ['Onsite', 'Remote', 'Hybrid'], default: 'Onsite' },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract'], default: 'Full-time' },
  salary: String,                    // jobs
  budget: Number,                    // projects
  duration: String,                  // projects
  deadline: Date,
  openings: { type: Number, default: 1 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
}, { timestamps: true });

const applicationSchema = new Schema({
  job: { ...ref('Job'), required: true },
  student: { ...ref('User'), required: true },
  employer: { ...ref('User'), required: true },
  resume: ref('Resume'),
  coverLetter: String,
  status: { type: String, enum: ['Applied', 'Shortlisted', 'Interview', 'Accepted', 'Rejected', 'Withdrawn', 'Completed'], default: 'Applied' },
  interview: { date: Date, mode: String, link: String, notes: String },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  updates: [{ note: String, progress: Number, at: { type: Date, default: Date.now } }],
}, { timestamps: true });
applicationSchema.index({ job: 1, student: 1 }, { unique: true });

const resumeSchema = new Schema({
  user: { ...ref('User'), required: true },
  title: { type: String, required: true, trim: true },
  isDefault: { type: Boolean, default: false },
    file: {
    storedName: String,
    originalName: String,
    mimeType: String,
    size: Number,
  },
  data: {
    fullName: String, email: String, phone: String, location: String, summary: String,
    education: [{ school: String, degree: String, year: String }],
    experience: [{ role: String, company: String, duration: String, description: String }],
    projects: [{ name: String, description: String }],
    skills: [String], certifications: [String],
  },
}, { timestamps: true });

const notificationSchema = new Schema({
  user: { ...ref('User'), required: true },
  title: String, message: String, link: String,
  read: { type: Boolean, default: false },
}, { timestamps: true });

const messageSchema = new Schema({
  sender: { ...ref('User'), required: true },
  receiver: { ...ref('User'), required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

const reviewSchema = new Schema({
  from: { ...ref('User'), required: true },
  to: { ...ref('User'), required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });
reviewSchema.index({ from: 1, to: 1 }, { unique: true });

export const User = model('User', userSchema);
export const Job = model('Job', jobSchema);
export const Application = model('Application', applicationSchema);
export const Resume = model('Resume', resumeSchema);
export const Notification = model('Notification', notificationSchema);
export const Message = model('Message', messageSchema);
export const Review = model('Review', reviewSchema);
