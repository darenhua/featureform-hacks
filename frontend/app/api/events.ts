import axios from "axios";
<<<<<<< HEAD

const API_URL = "http://localhost:3000/api";
=======
import Constants from "expo-constants";

const NODE_URL = Constants.expoConfig?.extra?.NODE_URL;
>>>>>>> 59022dc6a3da5ea0908aa9c95b7c6fc48caa0068

export interface EventFormData {
  name: string;
  location: string;
  date: string;
  time: string;
  description: string;
  image_url: string;
}

export interface Event extends EventFormData {
  id: string;
  created_at?: string;
}

export async function createEvent(data: EventFormData) {
<<<<<<< HEAD
    const response = await axios.post(`${API_URL}/event`, data);
    return response.data;
} 


export async function getAllEvents() {
    const response = await axios.get(`${API_URL}/event`);
    return response.data;
}

export async function getEventById(id: string) {
    const response = await axios.get(`${API_URL}/event/${id}`);
    return response.data;
}

export async function joinEvent(eventId: string, userId: string) {
    const response = await axios.post(`${API_URL}/event/${eventId}/join`, {
        user_id: userId
    });
    return response.data;
=======
  const response = await axios.post(`${NODE_URL}/event`, data);
  return response.data;
}

export async function getAllEvents() {
  const response = await axios.get(`${NODE_URL}/event`);
  return response.data;
}

export async function getEventById(id: string) {
  const response = await axios.get(`${NODE_URL}/event/${id}`);
  return response.data;
>>>>>>> 59022dc6a3da5ea0908aa9c95b7c6fc48caa0068
}
