import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";
import { getTasks } from "../services/taskService";
import { getInitials } from "../utils/helpers";
import { motion } from "framer-motion";
import { User, Mail, Briefcase, Shield, ListChecks, ArrowUpRight } from "lucide-react";
import Loader from "../components/common/Loader";

const TeamPage = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUsers(), getTasks()])
      .then(([u, t]) => {
        setUsers(u.users || []);
        setTasks(t.tasks || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
        <p className="text-slate-400">Collaboration is the heart of every great project.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {users.map((u, idx) => {
          const assignedCount = tasks.filter((task) => (task.assignedTo?._id === u._id || task.assignedTo === u._id)).length;
          const completedCount = tasks.filter((task) => (task.assignedTo?._id === u._id || task.assignedTo === u._id) && task.status === 'done').length;
          
          return (
            <motion.div 
              key={u._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-3xl p-6 hover:border-blue-500/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xl font-bold text-white shadow-lg shadow-blue-600/20">
                  {getInitials(u.name)}
                </div>
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  u.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {u.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                  {u.role}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{u.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail size={14} />
                  <span>{u.email}</span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <ListChecks size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Assigned</span>
                  </div>
                  <p className="text-xl font-bold">{assignedCount}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                  <div className="flex items-center gap-2 text-emerald-500/70 mb-1">
                    <CheckCircle2 size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Done</span>
                  </div>
                  <p className="text-xl font-bold">{completedCount}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-500">Member since {new Date(u.createdAt).toLocaleDateString()}</span>
                <button className="text-blue-400 hover:text-white transition-colors">
                  <ArrowUpRight size={20} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamPage;
