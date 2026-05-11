const { body, param, query } = require("express-validator");
const supabase = require("../config/supabase");
const { normalizeTask } = require("../utils/formatters");

const taskValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("project").isUUID().withMessage("Project ID is required"),
  body("assignedTo").isUUID().withMessage("Assigned user is required"),
  body("priority").optional().isIn(["Low", "Medium", "High"]),
  body("status").optional().isIn(["To Do", "In Progress", "Done"]),
  body("dueDate").optional({ values: "falsy" }).isISO8601().withMessage("Due date must be valid"),
];

const updateTaskValidation = [
  param("id").isUUID().withMessage("Invalid task ID"),
  body("priority").optional().isIn(["Low", "Medium", "High"]),
  body("status").optional().isIn(["To Do", "In Progress", "Done"]),
  body("dueDate").optional({ values: "falsy" }).isISO8601().withMessage("Due date must be valid"),
  body("project").optional().isUUID(),
  body("assignedTo").optional().isUUID(),
];

const listValidation = [
  query("project").optional().isUUID(),
  query("assignedTo").optional().isUUID(),
  query("status").optional().isIn(["To Do", "In Progress", "Done"]),
  query("priority").optional().isIn(["Low", "Medium", "High"]),
];

const getProjectById = async (projectId) => {
  const { data, error } = await supabase.from("projects").select("id, admin_id").eq("id", projectId).maybeSingle();
  if (error) throw error;
  return data;
};

const isProjectMember = async (projectId, userId) => {
  const { data, error } = await supabase
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
};

const createTask = async (req, res, next) => {
  try {
    const project = await getProjectById(req.body.project);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const creatorInProject = await isProjectMember(project.id, req.user._id);
    if (!creatorInProject) return res.status(403).json({ success: false, message: "Access denied" });

    const assigneeInProject = await isProjectMember(project.id, req.body.assignedTo);
    if (!assigneeInProject) return res.status(400).json({ success: false, message: "Assigned user must be a project member" });

    const payload = {
      title: req.body.title,
      description: req.body.description || "",
      due_date: req.body.dueDate || null,
      priority: req.body.priority || "Medium",
      status: req.body.status || "To Do",
      assigned_to: req.body.assignedTo,
      project: req.body.project,
      created_by: req.user._id,
    };

    const { data: task, error } = await supabase.from("tasks").insert(payload).select("id").single();
    if (error) throw error;

    const { data: detailed, error: fetchError } = await supabase
      .from("tasks")
      .select(
        `id, title, description, due_date, priority, status, created_at,
         assigned_to, assigned_to_user:users!tasks_assigned_to_fkey(id, name, email, role, created_at),
         created_by, created_by_user:users!tasks_created_by_fkey(id, name, email, role, created_at),
         project, project_info:projects(id, title)`
      )
      .eq("id", task.id)
      .single();

    if (fetchError) throw fetchError;

    res.status(201).json({ success: true, task: normalizeTask(detailed) });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    // 1. Get all projects the user is a member of
    const { data: memberRows, error: memberError } = await supabase
      .from("project_members")
      .select("project_id")
      .eq("user_id", req.user._id);

    if (memberError) throw memberError;

    const projectIds = (memberRows || []).map((row) => row.project_id);

    if (!projectIds.length && req.user.role !== "admin") {
      return res.json({ success: true, tasks: [] });
    }

    // 2. Query tasks
    let queryBuilder = supabase
      .from("tasks")
      .select(
        `id, title, description, due_date, priority, status, created_at,
         assigned_to, assigned_to_user:users!tasks_assigned_to_fkey(id, name, email, role, created_at),
         created_by, created_by_user:users!tasks_created_by_fkey(id, name, email, role, created_at),
         project, project_info:projects(id, title)`
      );

    // If member, only show tasks from their projects
    if (req.user.role !== "admin") {
      queryBuilder = queryBuilder.in("project", projectIds);
    }

    if (req.query.project) queryBuilder = queryBuilder.eq("project", req.query.project);
    if (req.query.status) queryBuilder = queryBuilder.eq("status", req.query.status);
    if (req.query.priority) queryBuilder = queryBuilder.eq("priority", req.query.priority);
    if (req.query.assignedTo) queryBuilder = queryBuilder.eq("assigned_to", req.query.assignedTo);
    if (req.query.search) queryBuilder = queryBuilder.ilike("title", `%${req.query.search}%`);

    const { data: tasks, error } = await queryBuilder.order("created_at", { ascending: false });
    if (error) throw error;

    res.json({ success: true, tasks: (tasks || []).map(normalizeTask) });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { data: task, error } = await supabase
      .from("tasks")
      .select(
        `id, title, description, due_date, priority, status, created_at,
         assigned_to, assigned_to_user:users!tasks_assigned_to_fkey(id, name, email, role, created_at),
         created_by, created_by_user:users!tasks_created_by_fkey(id, name, email, role, created_at),
         project, project_info:projects(id, title)`
      )
      .eq("id", req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    const member = await isProjectMember(task.project, req.user._id);
    if (!member) return res.status(403).json({ success: false, message: "Access denied" });

    res.json({ success: true, task: normalizeTask(task) });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { data: task, error } = await supabase
      .from("tasks")
      .select("id, project, assigned_to")
      .eq("id", req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    const project = await getProjectById(task.project);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const isAdminOfProject = project.admin_id === req.user._id;
    const isAssignee = task.assigned_to === req.user._id;

    if (req.user.role === "member") {
      if (!isAssignee) return res.status(403).json({ success: false, message: "Members can update only their tasks" });
      const allowed = ["status"];
      const invalidFields = Object.keys(req.body).filter((key) => !allowed.includes(key));
      if (invalidFields.length) return res.status(403).json({ success: false, message: "Members can only update status" });
    }

    if (req.user.role === "admin" && !isAdminOfProject) {
      return res.status(403).json({ success: false, message: "Only project admin can edit this task" });
    }

    if (req.body.assignedTo) {
      const inProject = await isProjectMember(task.project, req.body.assignedTo);
      if (!inProject) return res.status(400).json({ success: false, message: "Assigned user must be a project member" });
    }

    const updatePayload = {};
    if (req.body.title !== undefined) updatePayload.title = req.body.title;
    if (req.body.description !== undefined) updatePayload.description = req.body.description;
    if (req.body.dueDate !== undefined) updatePayload.due_date = req.body.dueDate || null;
    if (req.body.priority !== undefined) updatePayload.priority = req.body.priority;
    if (req.body.status !== undefined) updatePayload.status = req.body.status;
    if (req.body.assignedTo !== undefined) updatePayload.assigned_to = req.body.assignedTo;

    const { error: updateError } = await supabase.from("tasks").update(updatePayload).eq("id", req.params.id);
    if (updateError) throw updateError;

    const { data: detailed, error: fetchError } = await supabase
      .from("tasks")
      .select(
        `id, title, description, due_date, priority, status, created_at,
         assigned_to, assigned_to_user:users!tasks_assigned_to_fkey(id, name, email, role, created_at),
         created_by, created_by_user:users!tasks_created_by_fkey(id, name, email, role, created_at),
         project, project_info:projects(id, title)`
      )
      .eq("id", req.params.id)
      .single();

    if (fetchError) throw fetchError;

    res.json({ success: true, task: normalizeTask(detailed) });
  } catch (error) {
    next(error);
  }
};

const moveTask = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["To Do", "In Progress", "Done"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    req.body = { status };
    return updateTask(req, res, next);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { data: task, error } = await supabase.from("tasks").select("id, project").eq("id", req.params.id).maybeSingle();
    if (error) throw error;
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    const project = await getProjectById(task.project);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (project.admin_id !== req.user._id) {
      return res.status(403).json({ success: false, message: "Only project admin can delete task" });
    }

    const { error: deleteError } = await supabase.from("tasks").delete().eq("id", req.params.id);
    if (deleteError) throw deleteError;

    res.json({ success: true, message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  moveTask,
  taskValidation,
  updateTaskValidation,
  listValidation,
};
