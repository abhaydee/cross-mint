import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.BASE_URL || '';
const CANDIDATE_ID = process.env.CANDIDATE_ID || '';

// Simple validation to ensure we have the required variables
if (!BASE_URL || !CANDIDATE_ID) {
    throw new Error('Missing BASE_URL or CANDIDATE_ID in environment variables');
  }


// Let's initiate axios connection with crossmint API 
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });


// now, let's create a polynet at a specific position
export const createPolynet = async (row:number, column:number) : Promise<void> =>{
    try{
       await apiClient.post("/polynets", {
        row,
        column,
        candidateId: CANDIDATE_ID
       })
    }
  catch(error){
    console.log("creating polynet failed", error)
  }
}


export const deletePolynet = async (row: number, column:number) : Promise<void> =>{
    try{
        await apiClient.delete("/polyanets", {
            data : {row, column, candidateId: CANDIDATE_ID}
        })
    }
    catch(error){
        console.log("deleting polynet failed", error)
    }
}

