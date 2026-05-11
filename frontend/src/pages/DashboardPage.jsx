import { useEffect, useMemo, useState } from "react";
import { getTasks } from "../services/taskService";
import Loader from "../components/common/Loader";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, AlertTriangle, TrendingUp, Calendar } from "lucide-react";

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTasks()
      .then((res) => setTasks(res.tasks || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "done").length;
    const pending = tasks.filter((t) => t.status === "todo" || t.status === "in_progress").length;
    const overdue = tasks.filter((t) => t.due_date && t.status !== "done" && new Date(t.due_date) < new Date()).length;
    return { total, completed, pending, overdue };
  }, [tasks]);

  if (loading) return <Loader />;

  const statCards = [
    { label: "Total Tasks", value: stats.total, color: "from-blue-600/20 to-blue-600/5", border: "border-blue-500/20", icon: <TrendingUp className="text-blue-400" /> },
    { label: "Completed", value: stats.completed, color: "from-emerald-600/20 to-emerald-600/5", border: "border-emerald-500/20", icon: <CheckCircle2 className="text-emerald-400" /> },
    { label: "Pending", value: stats.pending, color: "from-amber-600/20 to-amber-600/5", border: "border-amber-500/20", icon: <Clock className="text-amber-400" /> },
    { label: "Overdue", value: stats.overdue, color: "from-rose-600/20 to-rose-600/5", border: "border-rose-500/20", icon: <AlertTriangle className="text-rose-400" /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400">Welcome back! Here's what's happening today.</p>
        </div>
        <button className="btn-primary py-2 px-4 text-sm">
          <Calendar size={18} /> Daily Schedule
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -5 }}
            className={`relative overflow-hidden rounded-3xl border ${stat.border} bg-gradient-to-br ${stat.color} p-6 shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">{stat.label}</span>
              {stat.icon}
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-bold">{stat.value}</span>
              <span className="text-xs text-slate-500">Tasks</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass lg:col-span-2 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Tasks</h2>
            <button className="text-sm text-blue-400 hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <p className="py-10 text-center text-slate-500">No tasks found. Start by creating one!</p>
            ) : (
              tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-2xl bg-white/5 p-4 transition-colors hover:bg-white/10">
                  <div className="flex items-center gap-4">
                    <div className={`h-2 w-2 rounded-full ${task.status === 'done' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-slate-500">{new Date(task.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    task.status === 'done' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6">Team Activity</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                <div>
                  <p className="text-sm">
                    <span className="font-bold text-white">Admin</span> created a new project
                  </p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
