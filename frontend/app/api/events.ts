import axios from "axios";
import { API } from ".";

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
    const response = await axios.post(`${API.url}/event`, data);
    return response.data;
} 


export async function getAllEvents() {
    const response = await axios.get(`${API.url}/event`);
    return response.data;
}

export async function getEventById(id: string) {
    const response = await axios.get(`${API.url}/event/${id}`);
    return response.data;
}

