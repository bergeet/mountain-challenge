import { db } from "./database";

export const migrate = () => {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )`,
      (err: Error) => {
        if (err) {
          console.error("Error migrating database", err);
        } else {
          console.log("Migration successful");
        }
      }
    );
  });
};
