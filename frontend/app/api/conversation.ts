import axios from "axios";

const CONVERSATION_BASE_URL = "https://81be-209-0-75-246.ngrok-free.app";

export interface StartConversationRequest {
  person1Id: number;
  person2Id: number;
  eventId: number;
  dump1: string; // long_description of person1
  dump2: string; // long_description of person2
}

export interface StartConversationResponse {
  conversation_group_id: number;
}

export interface ContinueConversationRequest {
  conversation_group_id: number;
  transcript: string;
}

export interface ContinueConversationResponse {
  message?: string;
  snippet_summary?: string;
  new_topics?: string | string[];  // Can be either string or string array
  // Legacy fields for backward compatibility
  summary?: string;
  nextTopics?: string[];
}

// Start a new conversation
export async function startConversation(data: StartConversationRequest): Promise<StartConversationResponse> {
  try {
    console.log('Starting conversation with data:', JSON.stringify(data, null, 2));
    const response = await axios.post(`https://81be-209-0-75-246.ngrok-free.app/conversation/start`, data, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/11.1.0'
      }
    });
    console.log('Conversation started successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error starting conversation:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

// Continue an existing conversation
export async function continueConversation(data: ContinueConversationRequest): Promise<ContinueConversationResponse> {
  try {
    const response = await axios.post(`https://81be-209-0-75-246.ngrok-free.app/conversation/continue`, data, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/11.1.0'
      }
    });
    console.log('Conversation continued successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error continuing conversation:', error);
    throw error;
  }
}