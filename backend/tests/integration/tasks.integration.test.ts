import request from "supertest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { closeDb } from "../../src/db/client.js";
import { TeamMemberRepository } from "../../src/repositories/team-member-repository.js";
import { seededTeamMembers } from "../../src/seed/team-members.js";

let tempDir: string;

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "kanban-tasks-"));
  process.env.DB_PATH = path.join(tempDir, "test.sqlite");
});

afterEach(() => {
  closeDb();
  fs.rmSync(tempDir, { recursive: true, force: true });
  delete process.env.DB_PATH;
});

describe("tasks API", () => {
  it("creates, assigns, and moves a task", async () => {
    const { createApp } = await import("../../src/app.js");
    const app = createApp();
    new TeamMemberRepository().replaceAll(seededTeamMembers);

    const projectResponse = await request(app).post("/api/projects").send({ name: "市场活动排期" });
    const projectId = projectResponse.body.id;

    const createTaskResponse = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .send({ title: "准备活动海报" });
    expect(createTaskResponse.status).toBe(201);

    const taskId = createTaskResponse.body.id;

    const assignResponse = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .send({ assigneeId: seededTeamMembers[0].id });
    expect(assignResponse.status).toBe(200);
    expect(assignResponse.body.assigneeId).toBe(seededTeamMembers[0].id);

    const statusResponse = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .send({ status: "done" });
    expect(statusResponse.status).toBe(200);
    expect(statusResponse.body.status).toBe("done");
  });
});
