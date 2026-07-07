import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { TaskItem, TaskStatus, TeamMember } from "../../types/task";
import TaskCard from "./TaskCard";

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: TaskItem[];
  members: TeamMember[];
  onAssign: (taskId: string, assigneeId: string | null) => Promise<void>;
}

export default function TaskColumn({ status, title, tasks, members, onAssign }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: "column",
      status
    }
  });

  return (
    <section className="card board-column">
      <div className="column-header">
        <span>{title}</span>
        <span>{tasks.length}</span>
      </div>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className="column-dropzone"
          style={{
            background: isOver ? "rgba(15, 108, 90, 0.06)" : "transparent",
            borderRadius: 16,
            padding: 4
          }}
        >
          {tasks.length === 0 ? (
            <div className="dropzone-empty">把任务拖到这里</div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} members={members} onAssign={onAssign} />
            ))
          )}
        </div>
      </SortableContext>
    </section>
  );
}
