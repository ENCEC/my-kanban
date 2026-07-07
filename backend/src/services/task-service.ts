import { ProjectRepository } from "../repositories/project-repository.js";
import { TaskRepository } from "../repositories/task-repository.js";
import { TeamMemberRepository } from "../repositories/team-member-repository.js";
import type { TaskStatus } from "../models/task.js";
import { TASK_STATUSES } from "../models/task.js";

export class TaskService {
  constructor(
    private readonly projects = new ProjectRepository(),
    private readonly tasks = new TaskRepository(),
    private readonly members = new TeamMemberRepository()
  ) {}

  listProjectBoard(projectId: string) {
    const project = this.projects.getById(projectId);
    if (!project) {
      this.raise("项目不存在", 404);
    }

    return {
      project: {
        id: project!.id,
        name: project!.name
      },
      members: this.members.listActive(),
      items: this.tasks.listByProject(projectId)
    };
  }

  createTask(projectId: string, input: { title: string; description?: string; assigneeId?: string | null }) {
    if (!this.projects.getById(projectId)) {
      this.raise("项目不存在", 404);
    }

    const title = input.title.trim();
    if (!title) {
      this.raise("任务标题不能为空", 400);
    }

    if (input.assigneeId && !this.members.getById(input.assigneeId)) {
      this.raise("负责人不存在", 400);
    }

    return this.tasks.create({
      projectId,
      title,
      description: input.description?.trim() || undefined,
      assigneeId: input.assigneeId ?? null,
      status: "todo"
    });
  }

  updateAssignee(taskId: string, assigneeId: string | null) {
    const task = this.tasks.getById(taskId);
    if (!task) {
      this.raise("任务不存在", 404);
    }

    if (assigneeId && !this.members.getById(assigneeId)) {
      this.raise("负责人不存在", 400);
    }

    return this.tasks.updateAssignee(taskId, assigneeId);
  }

  updateStatus(taskId: string, status: TaskStatus) {
    if (!TASK_STATUSES.includes(status)) {
      this.raise("状态不合法", 400);
    }

    const task = this.tasks.getById(taskId);
    if (!task) {
      this.raise("任务不存在", 404);
    }

    return this.tasks.updateStatus(taskId, status);
  }

  deleteTask(taskId: string) {
    const task = this.tasks.getById(taskId);
    if (!task) {
      this.raise("任务不存在", 404);
    }

    this.tasks.delete(taskId);
  }

  private raise(message: string, status: number): never {
    const error = new Error(message);
    (error as Error & { status?: number }).status = status;
    throw error;
  }
}
