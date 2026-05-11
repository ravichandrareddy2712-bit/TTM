import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../utils/helpers";
import { Bell, Search, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

const Topbar = () => {
  const { user } = useAuth();
  const [isLight, setIsLight] = useState(localStorage.getItem("theme") === "light");

  useEffect(() => {
    if (isLight) {
      document.body.classList.add("light-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    }
  }, [isLight]);

  return (
    <header className="relative z-20 flex h-20 items-center justify-between border-b border-white/5 bg-slate-900/50 px-8 backdrop-blur-2xl transition-colors duration-300">
      <div className="relative w-96 max-w-md hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder="Search tasks, projects..." 
          className="input-field pl-10 py-2 text-sm focus:bg-white/10"
        />
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => setIsLight(!isLight)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-blue-400 transition-all"
        >
          {isLight ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell size={22} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-slate-900" />
        </button>
        
        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role || 'Member'}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-white shadow-lg shadow-blue-600/20">
            {getInitials(user?.name)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
