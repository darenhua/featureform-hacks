import axios from "axios";
import Constants from "expo-constants";

const NODE_URL = "http://localhost:3000/api";

export async function createGroup(data: any) {
  const response = await axios.post(`${NODE_URL}/group`, data);
  return response.data;
}

export async function joinGroup(data: any) {
  const response = await axios.post(`${NODE_URL}/group/join`, data);
  return response.data;
}
