import type { Job, JobRow } from "./types";
import db from "./db.ts";

const maxRetry = 5;

class Queue {
  enqueue(element: Job): void {
    const stmt = db.prepare(
      `INSERT INTO job (id, payload, status, retryCount) VALUES (?, ?, ?, ?)`
    );

    stmt.run(
      element.id,
      JSON.stringify(element.payload),
      element.status,
      element.retryCount
    );
  }

  reserve(): Job | null {
    const visibilityTimeout = new Date(Date.now() - 30_000).toISOString();

    db.prepare(
      `
  UPDATE job
  SET status =
        CASE
        WHEN retryCount + 1 > ? THEN 'buried'
        ELSE 'ready'
        END,
      reservedAt = NULL,
      retryCount = retryCount + 1
  WHERE status = 'reserved'
    AND reservedAt IS NOT NULL
    AND reservedAt < ?
    `
    ).run(maxRetry, visibilityTimeout);

    const row = db
      .prepare(
        `SELECT * FROM job WHERE status = 'ready' ORDER BY id ASC LIMIT 1`
      )
      .get() as JobRow | undefined;

    if (!row) return null;

    const now = new Date();

    db.prepare(
      `
    UPDATE job
    SET status = ?, reservedAt = ?
    where id = ?`
    ).run("reserved", now.toISOString(), row.id);

    return {
      id: row.id,
      payload: JSON.parse(row.payload),
      status: "reserved",
      reservedAt: now,
      retryCount: row.retryCount,
    };
  }

  ack(id: string) {
    db.prepare(`DELETE FROM job WHERE id = ?`).run(id);
  }

  peek(): Job | null {
    const row = db
      .prepare(`SELECT * FROM job ORDER BY id ASC LIMIT 1`)
      .get() as JobRow;

    if (!row) return null;

    return {
      id: row.id,
      payload: JSON.parse(row.payload),
      status: row.status,
      reservedAt: row.reservedAt ? new Date(row.reservedAt) : undefined,
      retryCount: row.retryCount,
    };
  }

  isEmpty(): boolean {
    const row = db.prepare(`SELECT COUNT(*) as count FROM job`).get() as {
      count: number;
    };
    return row.count === 0;
  }

  size(): number {
    const row = db.prepare(`SELECT COUNT(*) as count FROM job`).get() as {
      count: number;
    };
    return row.count;
  }

  print() {
    const rows = db.prepare(`SELECT * FROM job`).all() as JobRow[];

    rows.forEach((row) => {
      console.log(JSON.parse(row.payload));
    });
  }
}

export const queue = new Queue();
