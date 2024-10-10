import { Logger } from './logger';

type TaskFunction = () => Promise<void>;

export class RequestQueue {
  private queue: TaskFunction[] = [];
  private isProcessing: boolean = false;
  private delay: number;

  constructor(initialDelay: number = 150) {
    this.delay = initialDelay; // Setting the initial delay time between requests
  }

  // Adding a task to the queue and starts processing if not already active
  public addTask(task: TaskFunction): void {
    this.queue.push(task);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  // Processes the queue sequentially with delay intervals
  private async processQueue(): Promise<void> {
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        try {
          await task();
          Logger.info(`Successfully completed a task. ${this.queue.length} tasks remaining.`);
        } catch (error) {
          // Handle failed tasks gracefully
        }
        await this.delayExecution(this.delay);
      }
    }
    this.isProcessing = false;
  }

  // Setting a dynamic delay based on API response headers
  public updateDelay(newDelay: number): void {
    this.delay = newDelay;
    Logger.warn(`Dynamic delay set to ${this.delay}ms based on API response.`);
  }

  // Resetting the delay to the default value
  public resetDelay(): void {
    this.delay = 250; // Reset to initial delay
  }

  // Adding delay between tasks to control the request rate
  private async delayExecution(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
