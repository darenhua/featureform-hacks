import axios from "axios";
import Constants from "expo-constants";

const NODE_URL = Constants.expoConfig?.extra?.NODE_URL;

export async function createGroup(data: any) {
  const response = await axios.post(`${NODE_URL}/group`, data);
  return response.data;
}

export async function joinGroup(data: any) {
  const response = await axios.post(`${NODE_URL}/group/join`, data);
  return response.data;
}
