import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { TaskItem, TeamMember } from "../../types/task";
import { STATUS_TITLES } from "../../types/task";
import AssigneeSelect from "./AssigneeSelect";

interface TaskCardProps {
  task: TaskItem;
  members: TeamMember[];
  onAssign: (taskId: string, assigneeId: string | null) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export default function TaskCard({ task, members, onAssign, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task
    }
  });

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      className={`task-card ${isDragging ? "dragging" : ""}`}
    >
      <div {...attributes} {...listeners} style={{ cursor: "grab" }}>
        <div className="task-meta">
          <span className="status-chip">{STATUS_TITLES[task.status]}</span>
          <span>{new Date(task.updatedAt).toLocaleString("zh-CN")}</span>
        </div>
        <h4 style={{ marginBottom: 8 }}>{task.title}</h4>
        {task.description ? <p className="inline-note">{task.description}</p> : null}
      </div>
      <AssigneeSelect value={task.assigneeId ?? null} members={members} onChange={(value) => onAssign(task.id, value)} />
      <div className="task-card-actions">
        <button className="danger-button" type="button" onClick={() => void onDelete(task.id)}>
          删除任务
        </button>
      </div>
    </article>
  );
}
