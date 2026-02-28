import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { queue } from "./queue.ts";
import { worker } from "./worker.ts";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/create", (req, res) => {
  const { payload } = req.body;

  if (!payload) {
    return res.status(400).json({ error: "Payload is required" });
  }

  queue.enqueue({
    id: uuidv4(),
    payload,
    status: "ready",
  });

  res.status(201).json({ message: "Job created successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  worker();
});
