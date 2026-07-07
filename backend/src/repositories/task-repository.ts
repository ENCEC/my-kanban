import { randomUUID } from "node:crypto";
import { getDb } from "../db/client.js";
import type { Task, TaskStatus } from "../models/task.js";

function mapTask(row: Record<string, unknown>): Task {
  return {
    id: String(row.id),
    projectId: String(row.project_id),
    title: String(row.title),
    description: row.description ? String(row.description) : null,
    status: row.status as TaskStatus,
    assigneeId: row.assignee_id ? String(row.assignee_id) : null,
    assignee: row.assignee_id
      ? {
          id: String(row.assignee_id),
          name: String(row.assignee_name),
          avatarText: row.avatar_text ? String(row.avatar_text) : null
        }
      : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

export class TaskRepository {
  listByProject(projectId: string) {
    const rows = getDb()
      .prepare(
        `SELECT t.*, tm.name AS assignee_name, tm.avatar_text
         FROM tasks t
         LEFT JOIN team_members tm ON tm.id = t.assignee_id
         WHERE t.project_id = ?
         ORDER BY t.created_at ASC`
      )
      .all(projectId) as Array<Record<string, unknown>>;

    return rows.map(mapTask);
  }

  getById(id: string) {
    const row = getDb()
      .prepare(
        `SELECT t.*, tm.name AS assignee_name, tm.avatar_text
         FROM tasks t
         LEFT JOIN team_members tm ON tm.id = t.assignee_id
         WHERE t.id = ?`
      )
      .get(id) as Record<string, unknown> | undefined;

    return row ? mapTask(row) : null;
  }

  create(input: { projectId: string; title: string; description?: string; assigneeId?: string | null; status: TaskStatus }) {
    const id = randomUUID();
    const now = new Date().toISOString();
    getDb()
      .prepare(
        "INSERT INTO tasks (id, project_id, title, description, status, assignee_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .run(id, input.projectId, input.title, input.description ?? null, input.status, input.assigneeId ?? null, now, now);
    return this.getById(id)!;
  }

  updateAssignee(taskId: string, assigneeId: string | null) {
    const now = new Date().toISOString();
    getDb().prepare("UPDATE tasks SET assignee_id = ?, updated_at = ? WHERE id = ?").run(assigneeId, now, taskId);
    return this.getById(taskId);
  }

  updateStatus(taskId: string, status: TaskStatus) {
    const now = new Date().toISOString();
    getDb().prepare("UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?").run(status, now, taskId);
    return this.getById(taskId);
  }
}
