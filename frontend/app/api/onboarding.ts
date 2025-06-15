import axios from "axios";
import Constants from "expo-constants";

//Sending Linkedin URL / Resume Info/ Interests
const onboarding = async () => {
  const response = await axios.get(
    `${Constants.expoConfig?.extra?.NODE_URL}/users`
  );
  console.log("Onboarding response:", response.data);
  return response.data;
};

export default onboarding;
