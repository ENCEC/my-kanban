import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { getConfig } from "../config.js";

let db: any = null;

export function getDb() {
  if (!db) {
    const config = getConfig();
    fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });
    db = new Database(config.dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }

  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
