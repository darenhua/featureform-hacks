import axios from "axios";
import Constants from "expo-constants";

const NODE_URL = "https://featureform-hacks.onrender.com/api";

export interface User {
  id: string;
  idfv: string;
  firstName?: string;
  lastName?: string;
  interests?: string[];
  headline?: string;
  bullet_points?: string[];
  processed?: boolean;
  embedding?: number[];
  short_description?: string;
  long_description?: string;
  work_history?: any[];
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserData {
  idfv: string;
}

export interface UpdateUserData {
  firstName?: string;
  oneLiner?: string;
}

export interface SimilarUsersRequest {
  idfv: string;
}

export interface SimilarUsersResponse {
  message: string;
  currentUser: {
    firstName: string;
    lastName: string;
    interests: string[];
  };
  similarUsers: {
    id: string;
    idfv: string;
    firstName: string;
    lastName: string;
    interests: string[];
    short_description?: string;
    headline?: string;
    embeddingSimilarity: number;
    interestSimilarity: number;
    combinedSimilarity: number;
  }[];
  totalFound: number;
}

// Get all users
export async function getAllUsers(): Promise<{ users: User[] }> {
  try {
    const response = await axios.get(`${NODE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<{ user: User }> {
  try {
    const response = await axios.get(`${NODE_URL}/user/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
}

// Create a new user
export async function createUser(userData: CreateUserData): Promise<{ message: string; user: User }> {
  try {
    const response = await axios.post(`${NODE_URL}/user`, userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Update user by ID
export async function updateUser(id: string, userData: UpdateUserData): Promise<{ message: string; user: User }> {
  try {
    const response = await axios.put(`${NODE_URL}/user/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
}

// Find similar users
export async function findSimilarUsers(data: SimilarUsersRequest): Promise<SimilarUsersResponse> {
  try {
    const response = await axios.post(`${NODE_URL}/user/find_similar_users`, data);
    return response.data;
  } catch (error) {
    console.error("Error finding similar users:", error);
    throw error;
  }
}

// Get user by IDFV
export async function getUserByIdfv(idfv: string): Promise<User | null> {
  try {
    const response = await axios.get(`${NODE_URL}/user/idfv/${idfv}`);
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null; // User not found
    }
    console.error("Error finding user by IDFV:", error);
    throw error;
  }
}
