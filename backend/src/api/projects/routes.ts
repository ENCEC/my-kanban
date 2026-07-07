import { Router } from "express";
import { ProjectService } from "../../services/project-service.js";

export function createProjectsRouter(projectService: ProjectService) {
  const router = Router();

  router.get("/", (_request, response) => {
    response.json({ items: projectService.listProjects() });
  });

  router.post("/", (request, response) => {
    const project = projectService.createProject(String(request.body?.name ?? ""));
    response.status(201).json(project);
  });

  router.get("/:projectId", (request, response) => {
    response.json(projectService.getProject(request.params.projectId));
  });

  return router;
}
