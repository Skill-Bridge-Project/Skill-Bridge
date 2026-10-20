// Fixed question-and-answer dataset for the SkillBridge Career Assistant (no external API).
export const GREETING = "Hi! Let's begin... I'm the SkillBridge Career Assistant. Select one of the questions below, or type your own, and I will guide you.";
export const FALLBACK = "I'm sorry, I don't have an answer for that question yet. Please select one of the suggested questions or rephrase your query.";

export const FAQ = [
  { q: 'What is SkillBridge?', keywords: ['skillbridge', 'what is', 'about', 'platform', 'purpose'],
    a: 'SkillBridge is a career platform that connects students with employers. Students learn and showcase skills, build resumes and apply for jobs, internships and freelance projects. Employers post opportunities, review applicants, schedule interviews and track work progress.' },
  { q: 'How do I create an account?', keywords: ['register', 'sign up', 'signup', 'create account', 'account', 'join'],
    a: 'Select Register on the home page and choose Student or Employer. Students provide their name, email, password and college details. Employers provide their company name and industry. You are signed in automatically once registration is complete.' },
  { q: 'How do I build a strong student profile?', keywords: ['profile', 'headline', 'bio', 'complete profile'],
    a: 'Open Profile and choose Edit. Add a clear headline, a short bio, your college and degree, and links to GitHub or LinkedIn. A complete profile improves recommendations and helps employers evaluate you quickly.' },
  { q: 'What is the skill portfolio?', keywords: ['portfolio', 'showcase', 'projects', 'skill portfolio'],
    a: 'The skill portfolio lists your skills with a proficiency level and the projects you have completed. Add each project with a description, technologies used and a link. Employers see this information when you apply.' },
  { q: 'How do I search for jobs?', keywords: ['search', 'find job', 'browse', 'look for', 'filter'],
    a: 'Use Browse Jobs or the search bar at the top of the page. You can filter by type, work mode, job type and location, and search by title, skill or keyword.' },
  { q: 'How do I apply for a job or internship?', keywords: ['apply', 'application', 'cover letter', 'submit'],
    a: 'Open the job, select Apply, choose one of your saved resumes and add an optional cover letter. Your application is sent to the employer immediately and appears in your application tracker.' },
  { q: 'How can I track my applications?', keywords: ['track', 'tracker', 'status', 'my applications', 'withdraw'],
    a: 'Open Applications to see every application with its current stage: Applied, Shortlisted, Interview, Accepted or Completed. You can also withdraw an application while it is still at the Applied or Shortlisted stage.' },
  { q: 'What are freelance projects?', keywords: ['freelance', 'project', 'gig', 'contract', 'budget'],
    a: 'Freelance projects are short-term assignments posted by companies. Each project lists its budget, duration, deadline, required skills and the specific requirements set by the company, so you can decide whether it suits you before applying.' },
  { q: 'How do I build a resume on SkillBridge?', keywords: ['resume builder', 'build resume', 'create resume', 'cv'],
    a: 'Open Resume Builder, enter your summary, education, experience, projects, skills and certifications, and check the live preview. Save it with a title. You can create several versions for different roles.' },
  { q: 'How do I manage my resumes?', keywords: ['manage resume', 'delete resume', 'update resume', 'default resume', 'edit resume'],
    a: 'Open Resumes to view, edit, rename, delete or set a default resume. The default resume is pre-selected when you apply for an opportunity.' },
  { q: 'What does the skill gap analyser do?', keywords: ['skill gap', 'gap', 'missing skills', 'analyser', 'analyzer'],
    a: 'The skill gap analyser compares your skills with those required for a target role or a specific job. It shows your match percentage, the skills you already have, the skills you lack, and a suggested learning plan.' },
  { q: 'How are jobs recommended to me?', keywords: ['recommend', 'suggestion', 'suitable', 'match'],
    a: 'Recommendations are based on the skills in your profile. Each open opportunity is scored by how many of its required skills you hold. Keep your skills up to date for more accurate matches.' },
  { q: 'Which skills are trending?', keywords: ['trending', 'in demand', 'demand', 'popular skills', 'top skills'],
    a: 'The Trending Skills page ranks skills by market demand, growth and the number of open opportunities on SkillBridge. Use it to decide which skills to learn next.' },
  { q: 'How do I prepare for an interview?', keywords: ['interview', 'prepare', 'preparation', 'tips'],
    a: 'Research the company, review the job requirements, and prepare examples from your projects that demonstrate each required skill. Practise explaining your work clearly, and join the scheduled interview a few minutes early.' },
  { q: 'Where can I see my scheduled interviews?', keywords: ['scheduled', 'interview date', 'interview schedule', 'interview link'],
    a: 'Open Interviews to see upcoming interviews with date, time, mode and meeting link. You also receive a notification whenever an employer schedules or changes an interview.' },
  { q: 'How do I contact an employer or student?', keywords: ['message', 'chat', 'contact', 'talk', 'conversation'],
    a: 'Use the chat icon at the top of the page to open the side chat. Select an existing conversation or start a new one with an employer or student. You can also use the Messages page.' },
  { q: 'How do notifications work?', keywords: ['notification', 'notify', 'alert', 'bell'],
    a: 'You are notified about new applications, status changes, interview schedules, progress updates, messages and reviews. Use the bell icon to view recent alerts, or open Notifications for the full list.' },
  { q: 'How do ratings and reviews work?', keywords: ['rating', 'review', 'feedback', 'stars'],
    a: 'Open Community Reviews to rate an employer or student from 1 to 5 stars and leave a comment. Reviews appear on public profiles and help others make informed decisions.' },
  { q: 'How do employers post jobs or projects?', keywords: ['post job', 'posting', 'hire', 'recruit', 'publish', 'employer post'],
    a: 'Employers open Manage Postings and select New posting. Choose Job or Freelance Project, then enter the description, required skills, requirements and compensation. Postings can be edited, closed or deleted at any time.' },
  { q: 'How do employers manage applicants?', keywords: ['applicants', 'shortlist', 'manage applicants', 'accept', 'reject', 'review applicants'],
    a: 'Employers open Applicants to view each candidate profile and resume, shortlist, accept or reject them, schedule interviews, and update work progress for accepted candidates.' },
  { q: 'How is work progress tracked?', keywords: ['progress', 'work progress', 'completion', 'milestone'],
    a: 'After accepting a candidate, the employer can record a progress percentage with a note. The student sees these updates in the application tracker, and the engagement is marked Completed at 100 percent.' },
  { q: 'How do I change my password or settings?', keywords: ['password', 'settings', 'change password', 'security', 'preferences'],
    a: 'Open Settings to change your password or update notification preferences. Passwords are stored in encrypted form.' },
  { q: 'Can I delete my account?', keywords: ['delete account', 'remove account', 'close account', 'deactivate'],
    a: 'Yes. Open Settings and choose Delete account. This permanently removes your profile, resumes, applications and messages, and it cannot be undone.' },
  { q: 'How can I improve my chances of getting hired?', keywords: ['improve', 'chances', 'get hired', 'career advice', 'stand out'],
    a: 'Keep your profile complete, list accurate skills, add portfolio projects with links, tailor your resume for each role, close skill gaps shown by the analyser, and respond promptly to employer messages.' },
];

const norm = (s) => ` ${s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()} `;

export function findAnswer(input) {
  const text = norm(input);
  if (/^ (hi|hello|hey|good morning|good evening)( |$)/.test(text) && text.trim().split(' ').length <= 3) return GREETING;
  const exact = FAQ.find((f) => norm(f.q) === text);
  if (exact) return exact.a;
  let best = null, score = 0;
  FAQ.forEach((f) => {
    const s = f.keywords.reduce((n, k) => (text.includes(` ${k}`) ? n + (k.includes(' ') ? 2 : 1) : n), 0);
    if (s > score) { score = s; best = f; }
  });
  return best ? best.a : FALLBACK;
}
