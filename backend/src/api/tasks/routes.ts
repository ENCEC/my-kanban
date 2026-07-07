import { Router } from "express";
import { TaskService } from "../../services/task-service.js";
import type { TaskStatus } from "../../models/task.js";

export function createTasksRouter(taskService: TaskService) {
  const router = Router();

  router.get("/projects/:projectId/tasks", (request, response) => {
    response.json(taskService.listProjectBoard(request.params.projectId));
  });

  router.post("/projects/:projectId/tasks", (request, response) => {
    const task = taskService.createTask(request.params.projectId, {
      title: String(request.body?.title ?? ""),
      description: request.body?.description ? String(request.body.description) : undefined,
      assigneeId: request.body?.assigneeId ? String(request.body.assigneeId) : null
    });
    response.status(201).json(task);
  });

  router.patch("/tasks/:taskId", (request, response) => {
    const updated = taskService.updateAssignee(
      request.params.taskId,
      request.body?.assigneeId ? String(request.body.assigneeId) : null
    );
    response.json(updated);
  });

  router.patch("/tasks/:taskId/status", (request, response) => {
    const updated = taskService.updateStatus(request.params.taskId, String(request.body?.status ?? "") as TaskStatus);
    response.json(updated);
  });

  return router;
}
