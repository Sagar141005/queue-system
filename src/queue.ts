import type { Job } from "./types";

class Queue {
  items: Job[];
  constructor() {
    this.items = [];
  }

  enqueue(element: Job) {
    this.items.push(element);
  }

  dequeue() {
    return this.isEmpty() ? "Queue is empty" : this.items.shift();
  }

  peek() {
    return this.isEmpty() ? "Queue is empty" : this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  print() {
    console.log(this.items.map((item) => item.payload).join(" -> "));
  }
}

export const queue = new Queue();
