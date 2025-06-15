import axios from "axios";
import { API } from "..//api";

export async function createGroup(data: any) {
    const response = await axios.post(`${API.url}/group`, data);
    return response.data;
}

export async function joinGroup(data: any) {
    const response = await axios.post(`${API.url}/group/join`, data);
    return response.data;
}

