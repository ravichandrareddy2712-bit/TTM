const normalizeUser = (user) => ({
  _id: user.id,
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.created_at,
});

const normalizeProject = (project) => ({
  _id: project.id,
  id: project.id,
  title: project.title,
  description: project.description,
  admin: project.admin ? normalizeUser(project.admin) : project.admin_id ? { _id: project.admin_id, id: project.admin_id } : null,
  members: (project.project_members || []).map((pm) => normalizeUser(pm.user)).filter(Boolean),
  tasks: project.tasks || [],
  createdAt: project.created_at,
});

const normalizeTask = (task) => ({
  _id: task.id,
  id: task.id,
  title: task.title,
  description: task.description,
  dueDate: task.due_date,
  priority: task.priority,
  status: task.status,
  assignedTo: task.assigned_to_user ? normalizeUser(task.assigned_to_user) : task.assigned_to ? { _id: task.assigned_to, id: task.assigned_to } : null,
  project: task.project_info
    ? { _id: task.project_info.id, id: task.project_info.id, title: task.project_info.title }
    : task.project
    ? { _id: task.project, id: task.project }
    : null,
  createdBy: task.created_by_user ? normalizeUser(task.created_by_user) : task.created_by ? { _id: task.created_by, id: task.created_by } : null,
  createdAt: task.created_at,
});

module.exports = { normalizeUser, normalizeProject, normalizeTask };
