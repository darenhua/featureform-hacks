import axios from "axios";
import Constants from "expo-constants";

const NODE_URL = Constants.expoConfig?.extra?.NODE_URL;

//Sending Linkedin URL / Resume Info/ Interests
const onboarding = async (data: any) => {
  console.log(data);
  const response = await axios.get(`${NODE_URL}/users`);

  console.log("Onboarding response:", response.data);
  return response.data;
};

export default onboarding;
