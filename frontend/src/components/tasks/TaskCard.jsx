import { Calendar, Flag } from "lucide-react";
import { isOverdue } from "../../utils/helpers";

const TaskCard = ({ task, onEdit, onDelete, canManage, draggable = true }) => {
  const overdue = isOverdue(task.dueDate, task.status);
  return (
    <div
      className="glass mb-3 rounded-xl p-3"
      draggable={draggable}
      onDragStart={(event) => event.dataTransfer.setData("taskId", task._id)}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold">{task.title}</h4>
        <span className={`rounded-full px-2 py-1 text-xs ${task.priority === "High" ? "bg-rose-500/20" : task.priority === "Medium" ? "bg-amber-500/20" : "bg-emerald-500/20"}`}>{task.priority}</span>
      </div>
      <p className="mt-1 text-sm text-slate-400">{task.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
        <span className="inline-flex items-center gap-1"><Calendar size={12} />{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}</span>
        {overdue && <span className="rounded bg-rose-500/20 px-2 py-1 text-rose-300">Overdue</span>}
        <span className="inline-flex items-center gap-1"><Flag size={12} />{task.status}</span>
      </div>
      <p className="mt-2 text-xs text-slate-400">Assigned: {task.assignedTo?.name}</p>
      {canManage && (
        <div className="mt-3 flex gap-2">
          <button onClick={() => onEdit(task)} className="rounded bg-white/10 px-2 py-1 text-xs">Edit</button>
          <button onClick={() => onDelete(task._id)} className="rounded bg-rose-500/20 px-2 py-1 text-xs">Delete</button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
