import { queue } from "./queue.ts";

export function worker() {
  function processNext() {
    const job = queue.dequeue();

    if (!job) {
      console.log("Queue empty. Checking again in 2s...");
      setTimeout(processNext, 2000);
      return;
    }
    console.log("Processing job", job);

    setTimeout(processNext, 2000);
  }
  processNext();
}
