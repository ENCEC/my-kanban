import { requestJson } from "../../services/http";
import type { ProjectTasksResponse, TaskItem, TaskStatus } from "../../types/task";

export async function listProjectTasks(projectId: string) {
  return requestJson<ProjectTasksResponse>(`/api/projects/${projectId}/tasks`);
}

export async function createTask(projectId: string, payload: { title: string; description?: string; assigneeId?: string | null }) {
  return requestJson<TaskItem>(`/api/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateTask(taskId: string, payload: { title?: string; description?: string; assigneeId?: string | null }) {
  return requestJson<TaskItem>(`/api/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  return requestJson<TaskItem>(`/api/tasks/${taskId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}

export async function deleteTask(taskId: string) {
  return requestJson<void>(`/api/tasks/${taskId}`, {
    method: "DELETE"
  });
}
