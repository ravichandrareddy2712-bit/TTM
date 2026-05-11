import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import RoleGate from "../components/common/RoleGate";
import { useAuth } from "../context/AuthContext";
import { createProject, getProjects, updateProjectMembers } from "../services/projectService";
import { getUsers } from "../services/userService";

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });

  const loadData = async () => {
    const [projectRes, userRes] = await Promise.all([getProjects(), getUsers()]);
    setProjects(projectRes.projects || []);
    setUsers(userRes.users || []);
  };

  useEffect(() => { loadData(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await createProject(form);
    setForm({ title: "", description: "" });
    toast.success("Project created");
    loadData();
  };

  const toggleMember = async (project, memberId) => {
    const current = new Set(project.members.map((m) => m._id));
    if (current.has(memberId)) current.delete(memberId); else current.add(memberId);
    await updateProjectMembers(project._id, Array.from(current));
    loadData();
  };

  return (
    <div className="space-y-4">
      <RoleGate role="admin">
        <form onSubmit={create} className="glass grid gap-3 rounded-2xl p-4 md:grid-cols-3">
          <input className="rounded-lg bg-white/10 p-2" placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="rounded-lg bg-white/10 p-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="rounded-lg bg-blue-600 px-4 py-2">Create Project</button>
        </form>
      </RoleGate>

      {projects.map((project) => (
        <div key={project._id} className="glass rounded-2xl p-4">
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <p className="text-sm text-slate-400">{project.description}</p>
          <p className="mt-2 text-xs text-slate-500">Members: {project.members.length}</p>
          {user.role === "admin" && (
            <div className="mt-3 flex flex-wrap gap-2">
              {users.map((u) => {
                const selected = project.members.some((m) => m._id === u._id);
                return <button key={u._id} onClick={() => toggleMember(project, u._id)} className={`rounded-full px-3 py-1 text-xs ${selected ? "bg-blue-600/30" : "bg-white/10"}`}>{u.name}</button>;
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectsPage;
