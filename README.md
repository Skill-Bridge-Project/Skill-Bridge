# SkillBridge — Learn. Create. Work.

MERN stack: React + Vite + Tailwind CSS 3 + daisyUI 4 (frontend), Node.js + Express + MongoDB + Mongoose + bcrypt + JWT (backend).

## Run

Backend (needs MongoDB running locally or an Atlas URI in `.env`):
    cd backend
    npm install
    npm run dev          # http://localhost:5000

Frontend:
    cd frontend
    npm install
    npm run dev          # http://localhost:5173

## Try it
1. Register an employer, then post a job and a freelance project (Manage postings).
2. Register a student, add skills (Profile > Edit), build a resume, then browse and apply.
3. As the employer: shortlist, schedule an interview, accept, and update work progress.
4. Use the chat icon (top bar) for the side chat: messages between employer and student, plus the Assistant tab.

## Environment
backend/.env   PORT, MONGO_URI, JWT_SECRET, CLIENT_URL
frontend/.env  VITE_API_URL=http://localhost:5000/api
