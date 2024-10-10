// src/utils/RequestQueue.ts
import { Logger } from './logger';

type TaskFunction = () => Promise<void>;

export class RequestQueue {
  private queue: TaskFunction[] = [];
  private isProcessing: boolean = false;
  private delay: number;

  constructor(initialDelay: number = 250) {
    this.delay = initialDelay;
  }

  public addTask(task: TaskFunction): void {
    this.queue.push(task);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        try {
          await task();
          Logger.info(`Successfully completed a task. ${this.queue.length} tasks remaining.`);
        } catch (error) {
          Logger.warn(`Task failed. Retrying with delay: ${this.delay}ms.`);
        }
        await this.delayExecution(this.delay);
      }
    }
    this.isProcessing = false;
  }

  public updateDelay(newDelay: number): void {
    this.delay = newDelay;
    Logger.warn(`Dynamic delay set to ${this.delay}ms based on API response.`);
  }

  public resetDelay(): void {
    this.delay = 250; // Reset to initial delay
  }

  public getDelay(): number {
    return this.delay;
  }

  private async delayExecution(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
