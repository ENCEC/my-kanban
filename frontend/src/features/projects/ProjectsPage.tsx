import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { ProjectSummary } from "../../types/project";
import { createProject, listProjects } from "./projects.api";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    void refreshProjects();
  }, []);

  async function refreshProjects() {
    try {
      setLoading(true);
      const response = await listProjects();
      setProjects(response.items);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "加载项目失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setError("项目名称不能为空");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      const project = await createProject(name.trim());
      setSuccess("项目已创建");
      setName("");
      await refreshProjects();
      navigate(`/projects/${project.id}`);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "创建项目失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="inline-note">单团队验证版</p>
          <h1>团队 Kanban</h1>
        </div>
      </header>
      <section className="projects-grid">
        <form className="card project-form" onSubmit={handleCreateProject}>
          <h2>创建项目</h2>
          <div className="form-row">
            <label htmlFor="project-name">项目名称</label>
            <input
              id="project-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="例如：市场活动排期"
            />
          </div>
          {error ? <div className="error-text">{error}</div> : null}
          {success ? <div className="success-text">{success}</div> : null}
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "创建中..." : "创建并进入看板"}
          </button>
        </form>
        <section className="card project-list">
          <div className="page-header" style={{ marginBottom: 16 }}>
            <h2>项目列表</h2>
            <button className="secondary-button" type="button" onClick={() => void refreshProjects()}>
              刷新
            </button>
          </div>
          {loading ? <p>加载中...</p> : null}
          {!loading && projects.length === 0 ? (
            <p className="inline-note">还没有项目。先创建第一个项目开始验证流程。</p>
          ) : null}
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <Link className="project-link" to={`/projects/${project.id}`}>
                  <span>{project.name}</span>
                  <span>{project.taskCount} 个任务</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
