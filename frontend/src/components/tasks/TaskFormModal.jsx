import { useEffect, useState } from "react";
import { TASK_PRIORITY, TASK_STATUS } from "../../utils/constants";

const defaultForm = {
  title: "",
  description: "",
  dueDate: "",
  priority: "Medium",
  status: "To Do",
  assignedTo: "",
  project: "",
};

const TaskFormModal = ({ open, onClose, onSubmit, users, projects, initialTask }) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialTask) {
      setForm({
        ...defaultForm,
        ...initialTask,
        assignedTo: initialTask.assignedTo?._id || initialTask.assignedTo,
        project: initialTask.project?._id || initialTask.project,
        dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialTask, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="glass w-full max-w-xl rounded-2xl p-5">
        <h3 className="mb-3 text-lg font-semibold">{initialTask ? "Edit Task" : "Create Task"}</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg bg-white/10 p-2" placeholder="Title" required />
          <select value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="rounded-lg bg-white/10 p-2" required>
            <option value="">Select Project</option>
            {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
          <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="rounded-lg bg-white/10 p-2" required>
            <option value="">Assign user</option>
            {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>
          <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="rounded-lg bg-white/10 p-2" />
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="rounded-lg bg-white/10 p-2">{TASK_PRIORITY.map((p) => <option key={p}>{p}</option>)}</select>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-lg bg-white/10 p-2">{TASK_STATUS.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-3 w-full rounded-lg bg-white/10 p-2" placeholder="Description" />
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="rounded-lg bg-white/10 px-4 py-2" onClick={onClose}>Cancel</button>
          <button className="rounded-lg bg-blue-600 px-4 py-2">Save</button>
        </div>
      </form>
    </div>
  );
};

export default TaskFormModal;
