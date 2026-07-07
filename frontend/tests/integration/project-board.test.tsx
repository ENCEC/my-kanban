import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProjectBoardPage from "../../src/features/projects/ProjectBoardPage";
import { afterEach, describe, expect, it, vi } from "vitest";

const mockedTasksApi = vi.hoisted(() => ({
  listProjectTasks: vi.fn().mockResolvedValue({
    project: { id: "p1", name: "市场活动排期" },
    members: [{ id: "m1", name: "小李" }],
    items: [
      {
        id: "t1",
        projectId: "p1",
        title: "准备活动海报",
        status: "todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  updateTaskStatus: vi.fn(),
  deleteTask: vi.fn().mockResolvedValue(undefined)
}));

vi.mock("../../src/features/tasks/tasks.api", () => ({
  listProjectTasks: mockedTasksApi.listProjectTasks,
  createTask: mockedTasksApi.createTask,
  updateTask: mockedTasksApi.updateTask,
  updateTaskStatus: mockedTasksApi.updateTaskStatus,
  deleteTask: mockedTasksApi.deleteTask
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

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

  it("deletes a task from the current board", async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={["/projects/p1"]}>
        <Routes>
          <Route path="/projects/:projectId" element={<ProjectBoardPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("准备活动海报")).toBeInTheDocument();

    const deleteButtons = await screen.findAllByRole("button", { name: "删除任务" });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockedTasksApi.deleteTask).toHaveBeenCalledWith("t1");
    });
    expect(screen.queryByText("准备活动海报")).not.toBeInTheDocument();
    expect(screen.getByText("任务已删除")).toBeInTheDocument();

    confirmSpy.mockRestore();
  });
});
