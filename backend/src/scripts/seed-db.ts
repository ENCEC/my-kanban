import { initSchema } from "../db/init.js";
import { closeDb } from "../db/client.js";
import { TeamMemberRepository } from "../repositories/team-member-repository.js";
import { seededTeamMembers } from "../seed/team-members.js";

initSchema();
new TeamMemberRepository().replaceAll(seededTeamMembers);
closeDb();
console.log("Database seeded");
