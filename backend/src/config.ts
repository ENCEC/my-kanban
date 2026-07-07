import path from "node:path";

export function getConfig() {
  return {
    port: Number(process.env.PORT ?? 3001),
    dbPath: process.env.DB_PATH ?? path.resolve(process.cwd(), "data", "kanban.sqlite")
  };
}
