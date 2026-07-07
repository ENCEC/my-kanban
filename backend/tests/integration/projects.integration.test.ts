import request from "supertest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { closeDb } from "../../src/db/client.js";

let tempDir: string;

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "kanban-projects-"));
  process.env.DB_PATH = path.join(tempDir, "test.sqlite");
});

afterEach(() => {
  closeDb();
  fs.rmSync(tempDir, { recursive: true, force: true });
  delete process.env.DB_PATH;
});

describe("projects API", () => {
  it("creates and lists projects", async () => {
    const { createApp } = await import("../../src/app.js");
    const app = createApp();

    const createResponse = await request(app).post("/api/projects").send({ name: "市场活动排期" });
    expect(createResponse.status).toBe(201);

    const listResponse = await request(app).get("/api/projects");
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.items).toHaveLength(1);
    expect(listResponse.body.items[0].name).toBe("市场活动排期");
  });
});
