
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Send,
  User,
  Sparkles,
  BriefcaseBusiness,
  FileText,
  Code2,
  TrendingUp,
  MessageCircle,
  RotateCcw,
} from 'lucide-react';

const quickQuestions = [
  'How do I find a job?',
  'How can I improve my resume?',
  'How do I build my portfolio?',
  'Which skills should I learn?',
  'How do I prepare for interviews?',
  'How can I improve my skills?',
];

const knowledgeBase = [
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
    answer:
      'Hi! Welcome to SkillBridge Career Assistant. I can help you explore jobs, improve your resume, build your portfolio, and plan your career.',
    link: null,
  },
  {
    keywords: ['find job', 'find a job', 'search job', 'browse job', 'job opening', 'job opportunity', 'internship', 'vacancy'],
    answer:
      'Start by browsing available opportunities. Use keywords such as React, Python, design, or data analysis to find relevant listings. Check the requirements before applying.',
    link: { label: 'Browse Jobs', to: '/jobs' },
  },
  {
    keywords: ['resume', 'cv', 'curriculum vitae'],
    answer:
      'Create a clear, relevant resume. Include your education, technical skills, projects, internships, and certifications. Use simple formatting and tailor your resume to each opportunity.',
    link: { label: 'Manage My Resume', to: '/student/resumes' },
  },
  {
    keywords: ['portfolio', 'projects', 'showcase', 'github'],
    answer:
      'A portfolio demonstrates what you can do. Add your best projects, describe the problem each project solves, mention the technologies used, and include working links or screenshots when possible.',
    link: { label: 'My Portfolio', to: '/student/portfolio' },
  },
  {
    keywords: ['skill gap', 'missing skill', 'improve my skills', 'skills to improve', 'weakness'],
    answer:
      'Compare the skills you currently have with the requirements of your target role. Identify one or two gaps, learn the fundamentals, practise with small projects, and track your progress.',
    link: { label: 'Skill Gap Analyzer', to: '/student/skill-gap' },
  },
  {
    keywords: ['trending skill', 'in demand skill', 'future skill', 'popular skill', 'which skills', 'learn skill'],
    answer:
      'Choose skills based on your interests and the roles you want. Web development, programming, data analysis, cloud computing, and cybersecurity are useful areas to explore. Check current demand and job requirements before choosing a learning path.',
    link: { label: 'Explore Trending Skills', to: '/student/trending-skills' },
  },
  {
    keywords: ['interview', 'interview preparation', 'interview tips'],
    answer:
      'Prepare a short introduction, revise the fundamentals required for the role, practise explaining your projects, and prepare examples of how you solve problems. Research the employer and practise common questions aloud.',
    link: null,
  },
  {
    keywords: ['application', 'applied job', 'application status', 'track application'],
    answer:
      'You can review your job applications and check their current status from your student account. Keep your resume updated and check for employer messages or interview invitations.',
    link: { label: 'My Applications', to: '/student/applications' },
  },
  {
    keywords: ['profile', 'complete profile', 'student profile'],
    answer:
      'Keep your profile updated with your education, skills, career interests, projects, and experience. A complete profile helps employers understand your background.',
    link: { label: 'My Profile', to: '/student/profile' },
  },
  {
    keywords: ['employer', 'hire', 'post a job', 'recruitment'],
    answer:
      'Employers can create a company profile, publish opportunities, review applications, communicate with applicants, and schedule interviews through SkillBridge.',
    link: { label: 'Employer Registration', to: '/register/employer' },
  },
  {
    keywords: ['thank', 'thanks', 'thank you'],
    answer:
      "You're welcome! Keep learning, practising, and building projects. Small, consistent steps can help you move towards your career goals.",
    link: null,
  },
];

function getAnswer(question) {
  const text = question.toLowerCase().replace(/[^\w\s]/g, ' ');

  const matched = knowledgeBase.find((item) =>
    item.keywords.some((keyword) => {
      const phrase = keyword.toLowerCase();
      return text.includes(phrase);
    })
  );

  if (matched) {
    return matched;
  }

  return {
    answer:
      "I don't have a specific answer for that question yet. Try asking about jobs, resumes, portfolios, skills, interviews, applications, or profiles. For advice specific to your situation, you can also describe your target role and current skill level.",
    link: null,
  };
}

export default function CareerChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! 👋 I am your SkillBridge Career Assistant. What would you like help with today?',
      link: null,
    },
  ]);

  const [input, setInput] = useState('');

  function sendMessage(text) {
    const question = text.trim();

    if (!question) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: question,
      link: null,
    };

    const answer = getAnswer(question);

    const botMessage = {
      id: Date.now() + 1,
      sender: 'bot',
      text: answer.answer,
      link: answer.link,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      botMessage,
    ]);

    setInput('');
  }

  function resetChat() {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: 'Welcome back! What career question can I help you with?',
        link: null,
      },
    ]);
    setInput('');
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <Bot size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                Career Assistant
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Get guidance for your next career step
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetChat}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            <RotateCcw size={16} />
            Reset Chat
          </button>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <Sparkles size={21} />
            </div>

            <div>
              <p className="font-bold text-slate-900">
                SkillBridge Assistant
              </p>
              <p className="text-xs text-slate-500">
                Career guidance and platform help
              </p>
            </div>

            <span className="ml-auto rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Ready to help
            </span>
          </div>

          <div
            className="flex min-h-[360px] flex-col gap-5 p-4 sm:p-6"
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user'
                    ? 'flex-row-reverse'
                    : ''
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    message.sender === 'bot'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {message.sender === 'bot' ? (
                    <Bot size={19} />
                  ) : (
                    <User size={19} />
                  )}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                    message.sender === 'bot'
                      ? 'rounded-tl-sm bg-slate-100 text-slate-700'
                      : 'rounded-tr-sm bg-blue-600 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {message.text}
                  </p>

                  {message.link && (
                    <Link
                      to={message.link.to}
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                    >
                      {message.link.label}
                      <BriefcaseBusiness size={15} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 bg-white px-4 py-5 sm:px-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Suggested questions
            </p>

            <div className="mb-5 flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-left text-xs font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 sm:text-sm"
                >
                  {question}
                </button>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
            >
              <MessageCircle
                size={20}
                className="ml-2 shrink-0 text-slate-400"
              />

              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a career-related question..."
                aria-label="Ask a career-related question"
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={18} />
              </button>
            </form>

            <p className="mt-3 text-center text-xs text-slate-400">
              This assistant uses predefined career guidance. Its responses
              may not cover every question.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
