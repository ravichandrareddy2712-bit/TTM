const supabase = require("../config/supabase");
const { normalizeUser, normalizeTask } = require("../utils/formatters");

const getUsers = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ success: true, users: (data || []).map(normalizeUser) });
  } catch (error) {
    next(error);
  }
};

const getMyAssignedTasks = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select(
        `id, title, description, due_date, priority, status, created_at,
         assigned_to, assigned_to_user:users!tasks_assigned_to_fkey(id, name, email, role, created_at),
         created_by, created_by_user:users!tasks_created_by_fkey(id, name, email, role, created_at),
         project, project_info:projects(id, title)`
      )
      .eq("assigned_to", req.user._id)
      .order("due_date", { ascending: true });

    if (error) throw error;

    res.json({ success: true, tasks: (data || []).map(normalizeTask) });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getMyAssignedTasks };
