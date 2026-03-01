export type Status = "ready" | "reserved" | "delayed" | "buried";

export type Job = {
  id: string;
  payload: unknown;
  status: Status;
  reservedAt?: Date;
  retryCount: number;
};

export interface JobRow {
  id: string;
  payload: string;
  status: Status;
  reservedAt: string | null;
  retryCount: number;
}
