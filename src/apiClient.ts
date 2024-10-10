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
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Queue for Rate Limiting
const requestQueue = new RequestQueue();

// Helper function to parse retry headers and update the delay dynamically
const handleRateLimit = (error: any): void => {
  const retryAfter = error.response?.headers['retry-after'];
  if (retryAfter) {
    // Convert Retry-After header to milliseconds (if in seconds)
    const retryDelay = parseInt(retryAfter, 10) * 1000;
    requestQueue.updateDelay(retryDelay);
  } else {
    // Default increase if no Retry-After header is available
    requestQueue.updateDelay(requestQueue['delay'] * 2);
  }
};

// Centralized function to handle entity creation with dynamic rate limit handling
const createEntity = async (url: string, data: any): Promise<void> => {
  const task = async () => {
    try {
      await apiClient.post(url, data);
      Logger.info(`🪐 Successfully created entity at row ${data.row}, column ${data.column}`);
      requestQueue.resetDelay(); // Reset delay on success
    } catch (error: any) {
      if (error.response?.status === 429) {
        Logger.warn('Rate limit detected. Adjusting delay...');
        handleRateLimit(error); // Update delay based on response headers
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

// Create a Polyanet at a specific position
export const createPolyanet = (row: number, column: number): void => {
  createEntity('/polyanets', { row, column, candidateId: CANDIDATE_ID });
};

// Create a Soloon with a specific color (e.g., "red", "blue", "white", etc.)
export const createSoloon = (row: number, column: number, color: string): void => {
  createEntity('/soloons', { row, column, color, candidateId: CANDIDATE_ID });
};

// Create a Cometh with a specific direction (e.g., "up", "down", "left", "right")
export const createCometh = (row: number, column: number, direction: string): void => {
  createEntity('/comeths', { row, column, direction, candidateId: CANDIDATE_ID });
};
