import { randomUUID } from "node:crypto";
import { getDb } from "../db/client.js";
import type { Project, ProjectSummary } from "../models/project.js";

function mapProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    name: String(row.name),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

export class ProjectRepository {
  list() {
    const rows = getDb()
      .prepare(
        `SELECT p.id, p.name, p.created_at, p.updated_at, COUNT(t.id) AS task_count
         FROM projects p
         LEFT JOIN tasks t ON t.project_id = p.id
         GROUP BY p.id
         ORDER BY p.created_at DESC`
      )
      .all() as Array<Record<string, unknown>>;

    return rows.map((row) => ({
      ...mapProject(row),
      taskCount: Number(row.task_count)
    })) as ProjectSummary[];
  }

  getById(id: string) {
    const row = getDb().prepare("SELECT * FROM projects WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    return row ? mapProject(row) : null;
  }

  getByName(name: string) {
    const row = getDb().prepare("SELECT * FROM projects WHERE name = ?").get(name) as Record<string, unknown> | undefined;
    return row ? mapProject(row) : null;
  }

  create(name: string) {
    const id = randomUUID();
    const now = new Date().toISOString();
    getDb()
      .prepare("INSERT INTO projects (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)")
      .run(id, name, now, now);
    return this.getById(id)!;
  }
}
