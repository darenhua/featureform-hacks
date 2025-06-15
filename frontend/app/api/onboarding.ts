import axios from "axios";
import Constants from "expo-constants";
import { getVendorId } from "../../helper";

const NODE_URL = "http://localhost:3000/api";

export interface OnboardingData {
  linkedinURL: string;
  resume?: string; // base64 encoded file - optional
  resumeFileName?: string; // optional
  resumeMimeType?: string; // optional
  interests: string[];
  idfv: string;
}

const onboarding = async (data: OnboardingData) => {
  console.log("Sending onboarding data:", data);
  
  try {
    const response = await axios.post(`${NODE_URL}/user/onboard`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("Onboarding response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Onboarding error:", error);
    throw error;
  }
};

const processUser = async (data: any) => {
  console.log(data);
  const response = await axios.post(`${NODE_URL}/user/process`, data);
  console.log("Process user response:", response.data);
  return response.data;
};

export { processUser };
export default onboarding;
