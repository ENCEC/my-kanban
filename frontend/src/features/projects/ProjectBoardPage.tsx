import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ProjectTasksResponse, TaskItem, TaskStatus } from "../../types/task";
import BoardDndContext from "../tasks/BoardDndContext";
import TaskComposer from "../tasks/TaskComposer";
import { createTask, deleteTask, listProjectTasks, updateTask, updateTaskStatus } from "../tasks/tasks.api";

export default function ProjectBoardPage() {
  const { projectId = "" } = useParams();
  const [board, setBoard] = useState<ProjectTasksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      void refreshBoard();
    }
  }, [projectId]);

  async function refreshBoard() {
    try {
      setLoading(true);
      setError(null);
      const response = await listProjectTasks(projectId);
      setBoard(response);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "加载看板失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(payload: { title: string; description?: string; assigneeId?: string | null }) {
    const created = await createTask(projectId, payload);
    setBoard((current) =>
      current
        ? {
            ...current,
            items: [...current.items, created]
          }
        : current
    );
    setMessage("任务已创建");
  }

  async function handleAssign(taskId: string, assigneeId: string | null) {
    const updated = await updateTask(taskId, { assigneeId });
    replaceTask(updated);
    setMessage("负责人已更新");
  }

  async function handleDeleteTask(taskId: string) {
    const currentTask = board?.items.find((task) => task.id === taskId);
    if (!currentTask) {
      return;
    }

    const confirmed = window.confirm(`确认删除任务“${currentTask.title}”吗？此操作不可撤销。`);
    if (!confirmed) {
      return;
    }

    setError(null);
    setMessage(null);

    await deleteTask(taskId);
    setBoard((current) =>
      current
        ? {
            ...current,
            items: current.items.filter((task) => task.id !== taskId)
          }
        : current
    );
    setMessage("任务已删除");
  }

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    setMessage(null);
    const previous = board?.items ?? [];
    setBoard((current) =>
      current
        ? {
            ...current,
            items: current.items.map((task) => (task.id === taskId ? { ...task, status } : task))
          }
        : current
    );

    try {
      const updated = await updateTaskStatus(taskId, status);
      replaceTask(updated);
      setMessage("状态已更新");
    } catch (statusError) {
      setBoard((current) => (current ? { ...current, items: previous } : current));
      setError(statusError instanceof Error ? statusError.message : "状态更新失败");
    }
  }

  function replaceTask(updated: TaskItem) {
    setBoard((current) =>
      current
        ? {
            ...current,
            items: current.items.map((task) => (task.id === updated.id ? updated : task))
          }
        : current
    );
  }

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <Link to="/" className="secondary-button" style={{ textDecoration: "none" }}>
            返回项目列表
          </Link>
          <h1 style={{ marginTop: 16 }}>{board?.project.name ?? "项目看板"}</h1>
          <p className="inline-note">固定三列状态，用于快速验证任务流转。</p>
        </div>
        <button className="secondary-button" type="button" onClick={() => void refreshBoard()}>
          刷新看板
        </button>
      </div>

      {loading ? <p>加载中...</p> : null}
      {error ? <div className="error-text">{error}</div> : null}
      {message ? <div className="success-text">{message}</div> : null}

      {!loading && board ? (
        <>
          <TaskComposer members={board.members} onCreate={handleCreateTask} />
          <BoardDndContext
            tasks={board.items}
            members={board.members}
            onAssign={handleAssign}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTask}
          />
        </>
      ) : null}
    </main>
  );
}
