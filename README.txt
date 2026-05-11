TEAM TASK MANAGER - PROJECT DOCUMENTATION

OVERVIEW
A comprehensive team collaboration and task management platform built with React, Node.js, and Supabase.

KEY FEATURES
- User Authentication: Secure signup and login using JWT and Supabase.
- Project Management: Create projects, add descriptions, and assign admins.
- Team Collaboration: Add members to specific projects.
- Task Tracking: Create tasks with titles, descriptions, due dates, priority levels, and status updates.
- Responsive Design: Modern UI built with Tailwind CSS and Framer Motion.

TECH STACK
- Frontend: React, Vite, Tailwind CSS, Lucide React, Framer Motion, Axios.
- Backend: Node.js, Express, Supabase JS Client, JWT, BcryptJS.
- Database: PostgreSQL (Supabase).

LOCAL SETUP

Prerequisites:
- Node.js installed
- Supabase account

1. Clone the repository:
   git clone <repository-url>
   cd team-task-manager

2. Backend Setup:
   - Navigate to the backend folder: cd backend
   - Install dependencies: npm install
   - Create a .env file from .env.example and add your credentials.
   - Run the backend: npm run dev

3. Frontend Setup:
   - Navigate to the frontend folder: cd frontend
   - Install dependencies: npm install
   - Create a .env file from .env.example.
   - Run the frontend: npm run dev

SUPABASE SETUP
1. Create a new project on Supabase (https://supabase.com/).
2. Go to the SQL Editor and run the content of backend/src/config/schema.sql.
3. Obtain your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from Project Settings > API.

ENVIRONMENT VARIABLES

Backend (.env):
- PORT: Server port (default: 5000)
- SUPABASE_URL: Your Supabase project URL
- SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key
- JWT_SECRET: A long random secret key for JWT signing
- CLIENT_URL: Frontend URL (default: http://localhost:5173)
- NODE_ENV: development or production

Frontend (.env):
- VITE_API_URL: Backend API URL (default: http://localhost:5000/api)

DEPLOYMENT STEPS
- Backend: Deploy to Railway (recommended) or Render. Ensure environment variables are set.
- Frontend: Deploy to Vercel or Netlify. Set VITE_API_URL to your live backend URL.
- Database: Already hosted on Supabase.

DEMO CREDENTIALS
- Admin: admin@example.com / admin123
- Member: member@example.com / member123

FOLDER STRUCTURE
team-task-manager/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |   |-- schema.sql
|   |   |   `-- supabase.js
|   |   `-- server.js
|   |-- .env.example
|   |-- .gitignore
|   `-- package.json
|-- frontend/
|   |-- src/
|   |-- .env.example
|   |-- .gitignore
|   `-- package.json
`-- README.md
