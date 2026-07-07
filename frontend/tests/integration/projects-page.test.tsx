import { render, screen } from "@testing-library/react";
import ProjectsPage from "../../src/features/projects/ProjectsPage";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/features/projects/projects.api", () => ({
  listProjects: vi.fn().mockResolvedValue({ items: [] }),
  createProject: vi.fn()
}));

describe("ProjectsPage", () => {
  it("shows empty state when there are no projects", async () => {
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    expect(await screen.findByText("还没有项目。先创建第一个项目开始验证流程。")).toBeInTheDocument();
  });
});
