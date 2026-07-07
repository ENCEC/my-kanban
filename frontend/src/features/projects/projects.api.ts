import { requestJson } from "../../services/http";
import type { ProjectDetail, ProjectSummary } from "../../types/project";

export async function listProjects() {
  return requestJson<{ items: ProjectSummary[] }>("/api/projects");
}

export async function createProject(name: string) {
  return requestJson<ProjectDetail>("/api/projects", {
    method: "POST",
    body: JSON.stringify({ name })
  });
}

export async function getProject(projectId: string) {
  return requestJson<ProjectDetail>(`/api/projects/${projectId}`);
}
