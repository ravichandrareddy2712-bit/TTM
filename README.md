# Team Task Manager

A comprehensive team collaboration and task management platform built with React, Node.js, and Supabase.

## Features
- **User Authentication**: Secure signup and login using JWT and Supabase.
- **Project Management**: Create projects, add descriptions, and assign admins.
- **Team Collaboration**: Add members to specific projects.
- **Task Tracking**: Create tasks with titles, descriptions, due dates, priority levels, and status updates.
- **Responsive Design**: Modern UI built with Tailwind CSS and Framer Motion.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide React, Framer Motion, Axios.
- **Backend**: Node.js, Express, Supabase JS Client, JWT, BcryptJS.
- **Database**: PostgreSQL (Supabase).

## Local Setup

### Prerequisites
- Node.js installed
- Supabase account

### 1. Clone the repository
```bash
git clone <repository-url>
cd team-task-manager
```

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example` and add your credentials:
   ```bash
   cp .env.example .env
   ```
4. Run the backend in development mode:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Run the frontend in development mode:
   ```bash
   npm run dev
   ```

## Supabase Setup
1. Create a new project on [Supabase](https://supabase.com/).
2. Go to the SQL Editor and run the content of `backend/src/config/schema.sql`.
3. Obtain your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from Project Settings > API.

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `JWT_SECRET`: A long random secret key for JWT signing
- `CLIENT_URL`: Frontend URL (default: http://localhost:5173)
- `NODE_ENV`: development or production

### Frontend (.env)
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Run Commands

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```

## Deployment Steps
- **Backend**: Deploy to platforms like Render, Heroku, or Vercel. Ensure environment variables are set.
- **Frontend**: Deploy to platforms like Vercel, Netlify, or GitHub Pages.
- **Database**: Already hosted on Supabase.

## Demo Credentials
- **Admin**: admin@example.com / admin123
- **Member**: member@example.com / member123

## Folder Structure
```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── schema.sql
│   │   │   └── supabase.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
└── README.md
```
