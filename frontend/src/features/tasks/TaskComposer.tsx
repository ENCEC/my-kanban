import { useState } from "react";
import type { TeamMember } from "../../types/task";
import AssigneeSelect from "./AssigneeSelect";

interface TaskComposerProps {
  members: TeamMember[];
  onCreate: (payload: { title: string; description?: string; assigneeId?: string | null }) => Promise<void>;
}

export default function TaskComposer({ members, onCreate }: TaskComposerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      setError("任务标题不能为空");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onCreate({
        title: title.trim(),
        description: description.trim() || undefined,
        assigneeId
      });
      setTitle("");
      setDescription("");
      setAssigneeId(null);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "创建任务失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card task-composer" onSubmit={handleSubmit}>
      <h3>添加任务</h3>
      <div className="form-row">
        <label htmlFor="task-title">标题</label>
        <input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="例如：准备活动海报"
        />
      </div>
      <div className="form-row">
        <label htmlFor="task-description">说明</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          placeholder="补充任务细节（可选）"
        />
      </div>
      <AssigneeSelect value={assigneeId} members={members} onChange={setAssigneeId} />
      {error ? <div className="error-text">{error}</div> : null}
      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? "保存中..." : "创建任务"}
      </button>
    </form>
  );
}
