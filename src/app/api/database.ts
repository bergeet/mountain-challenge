import path from "path";
import sqlite3 from "sqlite3";

const dbPath = path.join(process.cwd(), "db.sqlite");
export const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("Error opening database", err);
    } else {
      console.log("Database opened");
    }
  }
);
