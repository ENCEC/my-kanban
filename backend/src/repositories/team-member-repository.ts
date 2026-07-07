import { getDb } from "../db/client.js";
import type { TeamMember } from "../models/team-member.js";

function mapMember(row: Record<string, unknown>): TeamMember {
  return {
    id: String(row.id),
    name: String(row.name),
    avatarText: row.avatar_text ? String(row.avatar_text) : null,
    isActive: Boolean(row.is_active)
  };
}

export class TeamMemberRepository {
  listActive() {
    const rows = getDb().prepare("SELECT * FROM team_members WHERE is_active = 1 ORDER BY name ASC").all() as Array<Record<string, unknown>>;
    return rows.map(mapMember);
  }

  getById(id: string) {
    const row = getDb().prepare("SELECT * FROM team_members WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    return row ? mapMember(row) : null;
  }

  replaceAll(members: TeamMember[]) {
    const db = getDb();
    const insert = db.prepare(
      "INSERT OR REPLACE INTO team_members (id, name, avatar_text, is_active) VALUES (?, ?, ?, ?)"
    );
    const transaction = db.transaction((entries: TeamMember[]) => {
      entries.forEach((member) => insert.run(member.id, member.name, member.avatarText ?? null, member.isActive ? 1 : 0));
    });
    transaction(members);
  }
}
