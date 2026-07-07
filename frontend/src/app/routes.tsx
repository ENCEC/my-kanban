import { createBrowserRouter } from "react-router-dom";
import ProjectsPage from "../features/projects/ProjectsPage";
import ProjectBoardPage from "../features/projects/ProjectBoardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProjectsPage />
  },
  {
    path: "/projects/:projectId",
    element: <ProjectBoardPage />
  }
]);
