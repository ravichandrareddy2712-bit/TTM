import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import TaskBoard from "../components/tasks/TaskBoard";
import TaskFormModal from "../components/tasks/TaskFormModal";
import { useAuth } from "../context/AuthContext";
import { getProjects } from "../services/projectService";
import { createTask, deleteTask, getTasks, moveTask, updateTask } from "../services/taskService";
import { getUsers } from "../services/userService";

const TasksPage = () => {
  const { user } = useAuth();
  const canManage = user?.role === "admin";
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "", priority: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadData = async () => {
    const [tasksRes, usersRes, projectsRes] = await Promise.all([getTasks(), getUsers(), getProjects()]);
    setTasks(tasksRes.tasks || []);
    setUsers(usersRes.users || []);
    setProjects(projectsRes.projects || []);
  };

  useEffect(() => { loadData(); }, []);

  const filteredTasks = useMemo(() => tasks.filter((t) => {
    const bySearch = filters.search ? t.title.toLowerCase().includes(filters.search.toLowerCase()) : true;
    const byStatus = filters.status ? t.status === filters.status : true;
    const byPriority = filters.priority ? t.priority === filters.priority : true;
    return bySearch && byStatus && byPriority;
  }), [tasks, filters]);

  const onSaveTask = async (form) => {
    try {
      if (editingTask) await updateTask(editingTask._id, form);
      else await createTask(form);
      toast.success(editingTask ? "Task updated" : "Task created");
      setModalOpen(false);
      setEditingTask(null);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  const onDeleteTask = async (id) => {
    await deleteTask(id);
    toast.success("Task deleted");
    loadData();
  };

  const onMoveTask = async (taskId, status) => {
    try {
      await moveTask(taskId, status);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot move task");
    }
  };

  return (
    <div>
      <div className="glass mb-4 grid gap-3 rounded-2xl p-4 md:grid-cols-4">
        <input className="rounded-lg bg-white/10 p-2" placeholder="Search tasks" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <select className="rounded-lg bg-white/10 p-2" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All status</option><option>To Do</option><option>In Progress</option><option>Done</option></select>
        <select className="rounded-lg bg-white/10 p-2" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}><option value="">All priority</option><option>Low</option><option>Medium</option><option>High</option></select>
        {canManage ? <button className="rounded-lg bg-blue-600 px-4 py-2" onClick={() => { setEditingTask(null); setModalOpen(true); }}>Create Task</button> : <div className="text-sm text-slate-400">You can update your task status by drag-drop.</div>}
      </div>

      <TaskBoard tasks={filteredTasks} onMove={onMoveTask} onEdit={(task) => { setEditingTask(task); setModalOpen(true); }} onDelete={onDeleteTask} canManage={canManage} />

      <TaskFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingTask(null); }} onSubmit={onSaveTask} users={users} projects={projects} initialTask={editingTask} />
    </div>
  );
};

export default TasksPage;
