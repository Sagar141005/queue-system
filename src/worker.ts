import { queue } from "./queue.ts";

const baseDelay = 30000;

export function worker() {
  function processNext() {
    const job = queue.reserve();

    if (!job) {
      console.log("Queue empty. Checking again in 2s...");
      setTimeout(processNext, 2000);
      return;
    }

    try {
      console.log("Processing job", job);
      queue.ack(job.id);
      setTimeout(processNext, 2000);
    } catch (error) {
      setTimeout(processNext, baseDelay * Math.pow(2, job.retryCount));
    }
  }
  processNext();
}
