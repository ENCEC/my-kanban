import { ProjectRepository } from "../repositories/project-repository.js";

export class ProjectService {
  constructor(private readonly projects = new ProjectRepository()) {}

  listProjects() {
    return this.projects.list();
  }

  getProject(projectId: string) {
    const project = this.projects.getById(projectId);
    if (!project) {
      throw new Error("项目不存在");
    }
    return project;
  }

  createProject(name: string) {
    const normalizedName = name.trim();
    if (!normalizedName) {
      const error = new Error("项目名称不能为空");
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    if (this.projects.getByName(normalizedName)) {
      const error = new Error("项目名称已存在，请换一个名称");
      (error as Error & { status?: number }).status = 409;
      throw error;
    }

    return this.projects.create(normalizedName);
  }
}
