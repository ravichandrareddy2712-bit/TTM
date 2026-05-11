import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, Clock, CheckCircle2, Circle, AlertCircle, Trash2, UserPlus, Calendar } from "lucide-react";
import { getTasks, createTask, updateTaskStatus, deleteTask } from "../services/taskService";
import { getProjects } from "../services/projectService";
import { getUsers } from "../services/userService";
import Loader from "../components/common/Loader";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState({ status: "all", priority: "all", project: "all" });
  
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    project: "", 
    assignedTo: "", 
    priority: "medium", 
    dueDate: "" 
  });

  const loadData = async () => {
    try {
      const [taskRes, projRes, userRes] = await Promise.all([
        getTasks(),
        getProjects(),
        getUsers()
      ]);
      setTasks(taskRes.tasks || []);
      setProjects(projRes.projects || []);
      setUsers(userRes.users || []);
    } catch (error) {
      toast.error("Failed to load task data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.project) return toast.error("Please select a project");
    try {
      await createTask(form);
      setForm({ title: "", description: "", project: "", assignedTo: "", priority: "medium", dueDate: "" });
      setShowCreate(false);
      toast.success("Task created!");
      loadData();
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      toast.success(`Task marked as ${newStatus.replace('_', ' ')}`);
      loadData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this task?")) {
      try {
        await deleteTask(id);
        toast.success("Task removed");
        loadData();
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter.status !== "all" && t.status !== filter.status) return false;
    if (filter.priority !== "all" && t.priority !== filter.priority) return false;
    if (filter.project !== "all" && t.project?._id !== filter.project) return false;
    return true;
  });

  if (loading) return <Loader />;

  const columns = [
    { id: "todo", label: "To Do", icon: <Circle size={18} className="text-slate-500" /> },
    { id: "in_progress", label: "In Progress", icon: <Clock size={18} className="text-blue-400" /> },
    { id: "done", label: "Completed", icon: <CheckCircle2 size={18} className="text-emerald-400" /> }
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks Board</h1>
          <p className="text-slate-400">Track and manage your team's progress.</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">
          <Plus size={20} /> Create Task
        </button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass rounded-3xl p-8 border border-blue-500/20"
          >
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Task Title</label>
                  <input className="input-field" placeholder="What needs to be done?" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Project</label>
                  <select className="input-field" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} required>
                    <option value="">Select a project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Assign To</label>
                  <select className="input-field" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Priority</label>
                  <select className="input-field" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Due Date</label>
                  <input type="date" className="input-field" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <textarea className="input-field min-h-[100px]" placeholder="Add details..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary px-6">Cancel</button>
                <button type="submit" className="btn-primary px-8">Add Task</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter size={18} />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <select className="input-field py-1.5 px-3 text-xs w-auto" value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Completed</option>
        </select>
        <select className="input-field py-1.5 px-3 text-xs w-auto" value={filter.priority} onChange={e => setFilter({ ...filter, priority: e.target.value })}>
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select className="input-field py-1.5 px-3 text-xs w-auto" value={filter.project} onChange={e => setFilter({ ...filter, project: e.target.value })}>
          <option value="all">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {columns.map(col => (
          <div key={col.id} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                {col.icon}
                <h3 className="font-bold text-slate-300">{col.label}</h3>
              </div>
              <span className="text-xs font-bold bg-white/5 px-2 py-1 rounded-md text-slate-500">
                {filteredTasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            
            <div className="space-y-4 min-h-[500px]">
              {filteredTasks.filter(t => t.status === col.id).map(task => (
                <motion.div 
                  layout
                  key={task._id} 
                  className="glass p-5 rounded-2xl border-white/5 hover:border-blue-500/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      task.priority === 'high' ? 'bg-rose-500/10 text-rose-400' : 
                      task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {task.priority}
                    </span>
                    <button onClick={() => handleDelete(task._id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-rose-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <h4 className="font-bold text-white mb-2 leading-tight">{task.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{task.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar size={12} />
                      <span className="text-[10px] font-medium">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select 
                        className="bg-transparent text-[10px] font-bold text-blue-400 outline-none cursor-pointer hover:underline"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      >
                        <option value="todo">Move to To Do</option>
                        <option value="in_progress">Move to In Progress</option>
                        <option value="done">Move to Completed</option>
                      </select>
                      <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold border border-white/5">
                        {task.assignedTo?.name?.charAt(0) || '?'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
