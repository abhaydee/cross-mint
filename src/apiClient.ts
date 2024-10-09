// src/apiClient.ts
import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env file for sensitive info
dotenv.config();

// Base API URL and Candidate ID from environment variables
const BASE_URL = process.env.BASE_URL || '';
const CANDIDATE_ID = process.env.CANDIDATE_ID || '';

// Safety check to ensure we have the necessary configuration
if (!BASE_URL || !CANDIDATE_ID) {
  throw new Error('Missing BASE_URL or CANDIDATE_ID in environment variables. Please check your .env file!');
}

// Create an Axios instance for consistent API configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json', // Set JSON as the default content type for all requests
  },
});

/**
 * Helper function to add a delay between requests.
 * Useful to prevent hitting rate limits or when simulating slow network conditions.
 * @param ms Number of milliseconds to delay
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sequential execution of API requests with a manual delay between them.
 * @param fn Function to execute the HTTP request
 * @param delayMs Delay between each request in milliseconds
 */
const executeSequentially = async (fn: () => Promise<void>, delayMs = 1000): Promise<void> => {
  try {
    await fn();
    await delay(delayMs); // Introduce a delay between requests
  } catch (error) {
    console.error('❌ Error during request execution:', error);
    throw error;
  }
};

/**
 * Fetch the goal map for the candidate.
 * This map provides the blueprint for what our Megaverse should look like.
 * @returns 2D array representing the goal map
 */
export const getGoalMap = async (): Promise<string[][]> => {
  try {
    const response = await apiClient.get(`/map/${CANDIDATE_ID}/goal`);
    return response.data.goal;
  } catch (error) {
    console.error('❌ Error fetching the goal map. Please check the API configuration or network connection.');
    throw error;
  }
};

/**
 * Create a Polyanet at a specific position with sequential execution
 * @param row Row index in the grid
 * @param column Column index in the grid
 */
export const createPolyanet = async (row: number, column: number): Promise<void> => {
  await executeSequentially(async () => {
    await apiClient.post('/polyanets', { row, column, candidateId: CANDIDATE_ID });
    console.log(`🪐 Successfully created a Polyanet at row ${row}, column ${column}`);
  }, 1200); // Set a delay of 1200ms between each Polyanet creation
};

/**
 * Create a Soloon at a specified position with a given color.
 * @param row Row index in the grid
 * @param column Column index in the grid
 * @param color Color of the Soloon (e.g., "blue", "red")
 */
export const createSoloon = async (row: number, column: number, color: string): Promise<void> => {
  await executeSequentially(async () => {
    await apiClient.post('/soloons', { row, column, color, candidateId: CANDIDATE_ID });
    console.log(`🌙 Soloon (${color}) created at row ${row}, column ${column}`);
  }, 1200); // Set a delay of 1200ms between each Soloon creation
};

/**
 * Create a Cometh at a specified position with a given direction.
 * @param row Row index in the grid
 * @param column Column index in the grid
 * @param direction Direction of the Cometh (e.g., "up", "down", "left", "right")
 */
export const createCometh = async (row: number, column: number, direction: string): Promise<void> => {
  await executeSequentially(async () => {
    await apiClient.post('/comeths', { row, column, direction, candidateId: CANDIDATE_ID });
    console.log(`☄️ Cometh (${direction}) created at row ${row}, column ${column}`);
  }, 1200); // Set a delay of 1200ms between each Cometh creation
};
