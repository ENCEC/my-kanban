export type TaskStatus = "todo" | "in_progress" | "done";

export interface TeamMember {
  id: string;
  name: string;
  avatarText?: string | null;
}

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  assigneeId?: string | null;
  assignee?: TeamMember | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTasksResponse {
  project: {
    id: string;
    name: string;
  };
  members: TeamMember[];
  items: TaskItem[];
}

export const STATUS_TITLES: Record<TaskStatus, string> = {
  todo: "待处理",
  in_progress: "进行中",
  done: "已完成"
};
