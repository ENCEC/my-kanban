import express from "express";
import cors from "cors";
import { initSchema } from "./db/init.js";
import { ProjectService } from "./services/project-service.js";
import { TaskService } from "./services/task-service.js";
import { createProjectsRouter } from "./api/projects/routes.js";
import { createTasksRouter } from "./api/tasks/routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export function createApp() {
  initSchema();

  const app = express();
  const projectService = new ProjectService();
  const taskService = new TaskService();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({ ok: true });
  });

  app.use("/api/projects", createProjectsRouter(projectService));
  app.use("/api", createTasksRouter(taskService));
  app.use(errorHandler);

  return app;
}
