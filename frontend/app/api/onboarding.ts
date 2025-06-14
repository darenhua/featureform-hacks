import axios from "axios";
import { API } from ".";

//Sending Linkedin URL / Resume Info/ Interests 
const onboarding = async (data: any) => {
    const response = await axios.post(`${API.url}/onboarding`, data);
    return response.data;
}

export default onboarding;