import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { TaskItem, TaskStatus, TeamMember } from "../../types/task";
import { STATUS_TITLES } from "../../types/task";
import TaskColumn from "./TaskColumn";

interface BoardDndContextProps {
  tasks: TaskItem[];
  members: TeamMember[];
  onAssign: (taskId: string, assigneeId: string | null) => Promise<void>;
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
}

export default function BoardDndContext({
  tasks,
  members,
  onAssign,
  onStatusChange
}: BoardDndContextProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const groupedTasks: Record<TaskStatus, TaskItem[]> = {
    todo: tasks.filter((task) => task.status === "todo"),
    in_progress: tasks.filter((task) => task.status === "in_progress"),
    done: tasks.filter((task) => task.status === "done")
  };

  async function handleDragEnd(event: DragEndEvent) {
    const activeTaskId = String(event.active.id);
    const activeTask = tasks.find((task) => task.id === activeTaskId);
    if (!activeTask || !event.over) {
      return;
    }

    const overTask = tasks.find((task) => task.id === String(event.over?.id));
    const targetStatus = (overTask?.status ?? String(event.over.id)) as TaskStatus;
    if (targetStatus !== activeTask.status) {
      await onStatusChange(activeTask.id, targetStatus);
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="board-layout">
        {(Object.keys(groupedTasks) as TaskStatus[]).map((status) => (
          <TaskColumn
            key={status}
            status={status}
            title={STATUS_TITLES[status]}
            tasks={groupedTasks[status]}
            members={members}
            onAssign={onAssign}
          />
        ))}
      </div>
    </DndContext>
  );
}
