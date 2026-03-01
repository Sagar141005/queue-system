import Database from "better-sqlite3";

const db = new Database("database.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS job (
        id TEXT PRIMARY KEY,
        payload TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('ready', 'reserved', 'delayed', 'buried')),
        reservedAt TEXT,
        retryCount INTEGER NOT NULL
    )
`);

export default db;
