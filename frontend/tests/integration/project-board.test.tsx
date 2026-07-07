import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProjectBoardPage from "../../src/features/projects/ProjectBoardPage";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/features/tasks/tasks.api", () => ({
  listProjectTasks: vi.fn().mockResolvedValue({
    project: { id: "p1", name: "市场活动排期" },
    members: [{ id: "m1", name: "小李" }],
    items: [{ id: "t1", projectId: "p1", title: "准备活动海报", status: "todo", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]
  }),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  updateTaskStatus: vi.fn()
}));

describe("ProjectBoardPage", () => {
  it("renders board columns and task composer", async () => {
    render(
      <MemoryRouter initialEntries={["/projects/p1"]}>
        <Routes>
          <Route path="/projects/:projectId" element={<ProjectBoardPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("市场活动排期")).toBeInTheDocument();
    expect(screen.getByText("添加任务")).toBeInTheDocument();
    expect(screen.getAllByText("待处理").length).toBeGreaterThan(0);
  });
});
