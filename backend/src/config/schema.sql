-- DROP EXISTING TABLES AND TYPES TO START FRESH
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS project_members;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS task_status;
DROP TYPE IF EXISTS task_priority;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM VALUES
CREATE TYPE user_role AS ENUM ('admin', 'member');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

-- USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PROJECTS TABLE
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PROJECT_MEMBERS TABLE
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

-- TASKS TABLE
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    priority task_priority DEFAULT 'medium',
    status task_status DEFAULT 'todo',
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
