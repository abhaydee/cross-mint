// src/apiClient.ts
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
  headers: { 'Content-Type': 'application/json' },
});

// Request Queue for Rate Limiting
const requestQueue = new RequestQueue();

// Centralized function to handle entity creation with dynamic rate limit handling
const createEntity = async (url: string, data: Record<string, any>): Promise<void> => {
  const task = async () => {
    try {
      await apiClient.post(url, data);
      Logger.info(`🪐 Successfully created entity at row ${data.row}, column ${data.column}`);
      requestQueue.resetDelay(); // Reset delay on success
    } catch (error: any) {
      if (error.response?.status === 429) {
        Logger.warn('Rate limit detected. Adjusting delay...');
        requestQueue.updateDelay(requestQueue.getDelay() * 2); // Exponential backoff
        throw error;
      }
      Logger.error(`❌ Error creating entity: ${error.message}`);
    }
  };
  requestQueue.addTask(task);
};

// Fetch the goal map for the candidate
export const getGoalMap = async (): Promise<string[][]> => {
  try {
    const response = await apiClient.get(`/map/${CANDIDATE_ID}/goal`);
    Logger.info('Successfully fetched the goal map.');
    return response.data.goal;
  } catch (error) {
    throw error;
  }
};

// Entity creation functions
export const createPolyanet = (row: number, column: number): void => {
  createEntity('/polyanets', { row, column, candidateId: CANDIDATE_ID });
};

export const createSoloon = (row: number, column: number, color: string): void => {
  createEntity('/soloons', { row, column, color, candidateId: CANDIDATE_ID });
};

export const createCometh = (row: number, column: number, direction: string): void => {
  createEntity('/comeths', { row, column, direction, candidateId: CANDIDATE_ID });
};
