import axios from "axios";
import Constants from "expo-constants";

export async function createGroup(data: any) {
  const response = await axios.post(
    `${Constants.expoConfig?.extra?.NODE_URL}/group`,
    data
  );
  return response.data;
}

export async function joinGroup(data: any) {
  const response = await axios.post(
    `${Constants.expoConfig?.extra?.NODE_URL}/group/join`,
    data
  );
  return response.data;
}
