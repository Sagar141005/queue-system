type Status = "ready" | "reserved" | "delayed" | "buried";

export type Job = {
  id: string;
  payload: unknown;
  status: Status;
};
