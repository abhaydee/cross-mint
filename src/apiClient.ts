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

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Queue for Rate Limiting
const requestQueue = new RequestQueue();

export class MegaverseAPIClient {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  // Helper function to parse retry headers and update the delay dynamically
  private handleRateLimit(error: any): void {
    const retryAfter = error.response?.headers['retry-after'];
    if (retryAfter) {
      // Convert Retry-After header to milliseconds (if in seconds)
      const retryDelay = parseInt(retryAfter, 10) * 1000;
      requestQueue.updateDelay(retryDelay);
    } else {
      // Default increase if no Retry-After header is available
      requestQueue.updateDelay(requestQueue['delay'] * 1.25);
    }
  }

  // Centralized function to handle entity creation with dynamic rate limit handling
  private async createEntity(url: string, data: any): Promise<void> {
    const task = async () => {
      try {
        await this.client.post(url, data);
        Logger.info(`🪐 Successfully created entity at row ${data.row}, column ${data.column}`);
        requestQueue.resetDelay(); // Reset delay on success
      } catch (error: any) {
        if (error.response?.status === 429) {
          Logger.warn('Rate limit detected. Adjusting delay...');
          this.handleRateLimit(error); // Update delay based on response headers
          throw error;
        }
        Logger.error(`❌ Error creating entity: ${error.message}`);
      }
    };
    requestQueue.addTask(task);
  }

  // Fetching the goal map for the candidate
  public async getGoalMap(): Promise<string[][]> {
    try {
      const response = await this.client.get(`/map/${CANDIDATE_ID}/goal`);
      Logger.info('Successfully fetched the goal map.');
      return response.data.goal;
    } catch (error) {
      throw error;
    }
  }

  // Creating a Polyanet at a specific position
  public async createPolyanet(row: number, column: number): Promise<void> {
    console.log("row and column", row, column)
    return this.createEntity('/polyanets', { row, column, candidateId: CANDIDATE_ID });
  }

  // Creating a Soloon with a specific color (e.g., "red", "blue", "white", etc.)
  public async createSoloon(row: number, column: number, color: string): Promise<void> {
    return this.createEntity('/soloons', { row, column, color, candidateId: CANDIDATE_ID });
  }

  // Creating a Cometh with a specific direction (e.g., "up", "down", "left", "right")
  public async createCometh(row: number, column: number, direction: string): Promise<void> {
    return this.createEntity('/comeths', { row, column, direction, candidateId: CANDIDATE_ID });
  }
}

export const megaverseAPI = new MegaverseAPIClient(apiClient);
