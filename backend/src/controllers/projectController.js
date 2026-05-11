const { body, param } = require("express-validator");
const supabase = require("../config/supabase");
const { normalizeProject, normalizeTask } = require("../utils/formatters");

const objectIdValidation = [param("id").isUUID().withMessage("Invalid ID")];

const createProjectValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").optional().isString(),
];

const updateMembersValidation = [
  param("id").isUUID().withMessage("Invalid project ID"),
  body("members").isArray().withMessage("Members must be an array"),
  body("members.*").isUUID().withMessage("Each member must be a valid user ID"),
];

const createProject = async (req, res, next) => {
  try {
    const { data: project, error } = await supabase
      .from("projects")
      .insert({ title: req.body.title, description: req.body.description || "", admin_id: req.user._id })
      .select("id, title, description, admin_id, created_at")
      .single();

    if (error) throw error;

    const { error: memberError } = await supabase.from("project_members").insert({ project_id: project.id, user_id: req.user._id });
    if (memberError) throw memberError;

    res.status(201).json({ success: true, project: normalizeProject(project) });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    let memberRows = [];
    if (req.user.role === "admin") {
      const { data: adminProjects, error: adminError } = await supabase.from("projects").select("id").eq("admin_id", req.user._id);
      if (adminError) throw adminError;
      const adminProjectIds = (adminProjects || []).map((project) => project.id);
      if (!adminProjectIds.length) return res.json({ success: true, projects: [] });

      const { data, error } = await supabase.from("project_members").select("project_id").in("project_id", adminProjectIds);
      if (error) throw error;
      memberRows = data || [];
    } else {
      const { data, error } = await supabase.from("project_members").select("project_id").eq("user_id", req.user._id);
      if (error) throw error;
      memberRows = data || [];
    }

    const projectIds = [...new Set((memberRows || []).map((row) => row.project_id))];
    if (!projectIds.length) return res.json({ success: true, projects: [] });

    const { data: projects, error } = await supabase
      .from("projects")
      .select(
        `id, title, description, admin_id, created_at,
         admin:users!projects_admin_id_fkey(id, name, email, role, created_at),
         project_members(user:users(id, name, email, role, created_at))`
      )
      .in("id", projectIds)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, projects: (projects || []).map(normalizeProject) });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const { data: memberRow, error: memberError } = await supabase
      .from("project_members")
      .select("project_id")
      .eq("project_id", req.params.id)
      .eq("user_id", req.user._id)
      .maybeSingle();

    if (memberError) throw memberError;
    if (!memberRow) return res.status(403).json({ success: false, message: "Access denied" });

    const { data: project, error } = await supabase
      .from("projects")
      .select(
        `id, title, description, admin_id, created_at,
         admin:users!projects_admin_id_fkey(id, name, email, role, created_at),
         project_members(user:users(id, name, email, role, created_at))`
      )
      .eq("id", req.params.id)
      .single();

    if (error) throw error;

    const { data: tasks, error: taskError } = await supabase
      .from("tasks")
      .select(
        `id, title, description, due_date, priority, status, created_at,
         assigned_to,
         assigned_to_user:users!tasks_assigned_to_fkey(id, name, email, role, created_at),
         created_by,
         created_by_user:users!tasks_created_by_fkey(id, name, email, role, created_at),
         project,
         project_info:projects(id, title)`
      )
      .eq("project", req.params.id)
      .order("created_at", { ascending: false });

    if (taskError) throw taskError;

    res.json({ success: true, project: normalizeProject(project), tasks: (tasks || []).map(normalizeTask) });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { data: project, error } = await supabase
      .from("projects")
      .select("id, admin_id")
      .eq("id", req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (project.admin_id !== req.user._id) return res.status(403).json({ success: false, message: "Only project admin can update" });

    const { data: updated, error: updateError } = await supabase
      .from("projects")
      .update({
        title: req.body.title,
        description: req.body.description,
      })
      .eq("id", req.params.id)
      .select("id, title, description, admin_id, created_at")
      .single();

    if (updateError) throw updateError;

    res.json({ success: true, project: normalizeProject(updated) });
  } catch (error) {
    next(error);
  }
};

const updateMembers = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const { data: project, error } = await supabase.from("projects").select("id, admin_id").eq("id", projectId).maybeSingle();
    if (error) throw error;
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (project.admin_id !== req.user._id) return res.status(403).json({ success: false, message: "Only project admin can manage members" });

    const memberIds = [...new Set((req.body.members || []).map(String))];
    if (!memberIds.includes(project.admin_id)) memberIds.push(project.admin_id);

    const { error: delError } = await supabase.from("project_members").delete().eq("project_id", projectId);
    if (delError) throw delError;

    const inserts = memberIds.map((userId) => ({ project_id: projectId, user_id: userId }));
    if (inserts.length) {
      const { error: insError } = await supabase.from("project_members").insert(inserts);
      if (insError) throw insError;
    }

    const { data: updated, error: fetchError } = await supabase
      .from("projects")
      .select(
        `id, title, description, admin_id, created_at,
         admin:users!projects_admin_id_fkey(id, name, email, role, created_at),
         project_members(user:users(id, name, email, role, created_at))`
      )
      .eq("id", projectId)
      .single();

    if (fetchError) throw fetchError;

    res.json({ success: true, project: normalizeProject(updated) });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { data: project, error } = await supabase.from("projects").select("id, admin_id").eq("id", req.params.id).maybeSingle();
    if (error) throw error;
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    if (project.admin_id !== req.user._id) return res.status(403).json({ success: false, message: "Only project admin can delete" });

    const { error: deleteError } = await supabase.from("projects").delete().eq("id", req.params.id);
    if (deleteError) throw deleteError;

    res.json({ success: true, message: "Project deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  updateMembers,
  deleteProject,
  objectIdValidation,
  createProjectValidation,
  updateMembersValidation,
};
