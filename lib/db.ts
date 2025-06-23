import path from "path"; // Import the 'path' module
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: path.join(process.cwd(), "hackerNews.db"),
      driver: sqlite3.Database,
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY,
        title TEXT,
        author TEXT,
        score INTEGER,
        comments_count INTEGER,
        url TEXT,
        fetched_at INTEGER
      )
      `);
  }
  return db;
}
