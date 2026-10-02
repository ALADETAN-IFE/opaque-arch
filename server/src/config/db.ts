import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dir = "./data";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(path.join(dir, "app.db"), { verbose: console.log });

db.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)");

export default db;
