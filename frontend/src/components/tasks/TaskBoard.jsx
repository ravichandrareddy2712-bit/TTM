import { TASK_STATUS } from "../../utils/constants";
import TaskCard from "./TaskCard";

const TaskBoard = ({ tasks, onMove, onEdit, onDelete, canManage }) => {
  const handleDrop = (event, nextStatus) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("taskId");
    if (taskId && TASK_STATUS.includes(nextStatus)) onMove(taskId, nextStatus);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {TASK_STATUS.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status);
        return (
          <div
            key={status}
            className="glass min-h-64 rounded-2xl p-3"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, status)}
          >
            <h3 className="mb-3 font-semibold">{status} ({columnTasks.length})</h3>
            {columnTasks.map((task) => (
              <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} canManage={canManage} />
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default TaskBoard;
