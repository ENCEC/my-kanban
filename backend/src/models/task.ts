import type { TeamMember } from "./team-member.js";

export type TaskStatus = "todo" | "in_progress" | "done";

export const TASK_STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  assigneeId?: string | null;
  assignee?: Pick<TeamMember, "id" | "name" | "avatarText"> | null;
  createdAt: string;
  updatedAt: string;
}
