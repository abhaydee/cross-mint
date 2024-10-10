import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import { Logger } from './utils/logger';
import { RequestQueue } from './utils/RequestQueue';

dotenv.config();

const BASE_URL = process.env.BASE_URL || '';
const CANDIDATE_ID = process.env.CANDIDATE_ID || '';

if (!BASE_URL || !CANDIDATE_ID) {
  throw new Error('Missing BASE_URL or CANDIDATE_ID in environment variables');
}

export class MegaverseAPIClient {
  private apiClient: AxiosInstance;
  private requestQueue: RequestQueue;

  constructor() {
    this.apiClient = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.requestQueue = new RequestQueue();
  }

  // Fetching the goal map for the candidate
  public async getGoalMap(): Promise<string[][]> {
    try {
      const response = await this.apiClient.get(`/map/${CANDIDATE_ID}/goal`);
      Logger.info('Successfully fetched the goal map.');
      return response.data.goal;
    } catch (error) {
      throw error;
    }
  }

  // Centralizing function to handle entity creation with dynamic rate limit handling
  private async createEntity(url: string, data: any): Promise<void> {
    const task = async () => {
      try {
        await this.apiClient.post(url, data);
        Logger.info(`🪐 Successfully created entity at row ${data.row}, column ${data.column}`);
        this.requestQueue.resetDelay(); // Reset delay on success
      } catch (error: any) {
        if (error.response?.status === 429) {
          Logger.warn('Rate limit detected. Adjusting delay...');
          this.handleRateLimit(error); // Update delay based on response headers
          throw error;
        }
        Logger.error(`❌ Error creating entity: ${error.message}`);
      }
    };
    this.requestQueue.addTask(task);
  }

  // Helper function to parse retry headers and update the delay dynamically
  private handleRateLimit(error: any): void {
    const retryAfter = error.response?.headers['retry-after'];
    if (retryAfter) {
      // Converting Retry-After header to milliseconds (if in seconds)
      const retryDelay = parseInt(retryAfter, 10) * 1000;
      this.requestQueue.updateDelay(retryDelay);
    } else {
      // Default increase if no Retry-After header is available
      this.requestQueue.updateDelay(this.requestQueue['delay'] * 2);
    }
  }

  // Creating a Polyanet at a specific position
  public createPolyanet(row: number, column: number): void {
    this.createEntity('/polyanets', { row, column, candidateId: CANDIDATE_ID });
  }

  // Creating a Soloon with a specific color 
  public createSoloon(row: number, column: number, color: string): void {
    this.createEntity('/soloons', { row, column, color, candidateId: CANDIDATE_ID });
  }

  // Creating a Cometh with a specific direction 
  public createCometh(row: number, column: number, direction: string): void {
    this.createEntity('/comeths', { row, column, direction, candidateId: CANDIDATE_ID });
  }
}
