import { initSchema } from "../db/init.js";
import { closeDb } from "../db/client.js";

initSchema();
closeDb();
console.log("Database initialized");
