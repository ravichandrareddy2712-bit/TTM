import { LayoutDashboard, FolderKanban, ListChecks, Users, LogOut, Layout } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/team", label: "Team", icon: Users },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="relative z-30 flex h-full w-72 flex-col border-r border-white/5 bg-slate-900/50 backdrop-blur-2xl">
      <div className="flex items-center gap-3 px-8 py-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
          <Layout className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">Team Task Manager</span>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <Link 
              key={item.to} 
              to={item.to} 
              className={`relative flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 ${
                active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
              {active && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 h-6 w-1 rounded-r-full bg-white"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={logout} 
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-slate-400 transition-all hover:bg-rose-500/10 hover:text-rose-400"
        >
          <LogOut size={20} /> 
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
