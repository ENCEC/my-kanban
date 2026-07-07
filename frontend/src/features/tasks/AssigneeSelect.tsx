import type { TeamMember } from "../../types/task";

interface AssigneeSelectProps {
  value?: string | null;
  members: TeamMember[];
  onChange: (value: string | null) => void;
}

export default function AssigneeSelect({ value, members, onChange }: AssigneeSelectProps) {
  return (
    <label className="form-row">
      <span className="inline-note">负责人</span>
      <select
        aria-label="负责人"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
      >
        <option value="">未分配</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </select>
    </label>
  );
}
