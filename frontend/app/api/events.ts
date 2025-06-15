import axios from "axios";
import Constants from "expo-constants";

const NODE_URL = "http://localhost:3000/api";

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
}

export async function joinEvent(eventId: string, userId: string) {
  const response = await axios.post(`${NODE_URL}/event/${eventId}/join`, {
    user_id: userId,
  });
  return response.data;
}
