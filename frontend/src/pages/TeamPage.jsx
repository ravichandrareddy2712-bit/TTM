import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";
import { getTasks } from "../services/taskService";
import { getInitials } from "../utils/helpers";

const TeamPage = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    Promise.all([getUsers(), getTasks()]).then(([u, t]) => {
      setUsers(u.users || []);
      setTasks(t.tasks || []);
    });
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {users.map((u) => {
        const assignedCount = tasks.filter((task) => task.assignedTo?._id === u._id).length;
        return (
          <div key={u._id} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/30 font-semibold">{getInitials(u.name)}</div>
              <div>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm text-slate-400">{u.email}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="rounded-full bg-white/10 px-2 py-1 text-xs">{u.role}</span>
              <span className="text-sm text-slate-300">Assigned: {assignedCount}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamPage;
