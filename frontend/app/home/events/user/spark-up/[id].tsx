import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  ScrollView 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Audio } from 'expo-av';
import { COLORS, FONTS } from "../../../../styles/global";
import { mockPeople } from "../../../mock-people";
import axios from "axios";
import Constants from "expo-constants";
import { getVendorId } from "../../../../../helper";

interface ConversationResponse {
  summary?: string;
  nextTopics?: string[];
}

interface ConversationBubble {
  id: number;
  summary: string;
  nextTopics: string[];
}

const NODE_URL = Constants.expoConfig?.extra?.NODE_URL;

export default function SparkUpConversationPage() {
  const { id, eventId } = useLocalSearchParams();
  const router = useRouter();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [conversationBubbles, setConversationBubbles] = useState<ConversationBubble[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [currentUserIdfv, setCurrentUserIdfv] = useState<string | null>(null);
  
  let durationInterval: NodeJS.Timeout;

  useEffect(() => {
    setupAudio();
    fetchUser();
    getCurrentUserIdfv();
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  const getCurrentUserIdfv = async () => {
    try {
      const idfv = await getVendorId();
      setCurrentUserIdfv(idfv);
      console.log('Current user IDFV:', idfv);
    } catch (error) {
      console.error('Failed to get current user IDFV:', error);
    }
  };

  const setupAudio = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Microphone access is required for recording.');
        return;
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Failed to setup audio:', error);
    }
  };

  const fetchUser = async () => {
    setUserLoading(true);
    try {
      // First try to get from backend API
      const response = await axios.get(`${NODE_URL}/user/${id}`);
      setUser(response.data.user);
    } catch (error) {
      // Fallback to mock data
      console.log('API failed, using mock data for spark-up user:', id);
      const mockUser = mockPeople.find(person => person.userId === id || person.id === id);
      if (mockUser) {
        setUser({
          id: mockUser.id,
          userId: mockUser.userId,
          name: mockUser.name,
          firstName: mockUser.name.split(' ')[0],
          lastName: mockUser.name.split(' ').slice(1).join(' '),
          image: mockUser.image,
          bio: mockUser.bio,
          interests: mockUser.interests,
          workHistory: mockUser.workHistory
        });
      } else {
        setUser(null);
      }
    } finally {
      setUserLoading(false);
    }
  };

  const sendTranscriptionToEndpoint = async (transcription: string) => {
    try {
      // Use actual IDs from context
      const payload = {
        person1Idfv: currentUserIdfv || "unknown-current-user",
        person2Idfv: user?.userId || user?.id || user?.idfv || "unknown-other-user",
        eventId: eventId || "unknown-event-id",
        transcription: transcription
      };
      
      console.log('Sending transcription to endpoint:');
      console.log('====================================');
      console.log(JSON.stringify(payload, null, 2));
      console.log('====================================');
      
      // TODO: Uncomment when endpoint is ready
      // const response = await axios.post(`${NODE_URL}/api/conversation/transcription`, payload);
      // return response.data;
      
      // Mock response for now
      return {
        summary: transcription, // Show full transcription as summary
        nextTopics: [
          "Tell me more about your experience with that",
          "What challenges did you face?",
          "How did that make you feel?"
        ]
      };
      
    } catch (error) {
      console.error('Error sending transcription:', error);
      throw error;
    }
  };

  const startRecording = async () => {
    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration timer
      durationInterval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      console.log('Recording started');
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Unable to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    
    try {
      setIsRecording(false);
      setIsProcessing(true);
      clearInterval(durationInterval);
      
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri) {
        console.log(`Recording completed (${formatDuration(recordingDuration)})`);
        
        // Send to backend for transcription
        await transcribeAndProcess(uri);
      }
      
      setRecording(null);
      setRecordingDuration(0);
      
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to process recording');
    } finally {
      setIsProcessing(false);
    }
  };

  const transcribeAndProcess = async (audioUri: string) => {
    try {
      // Create FormData for audio file
      const formData = new FormData();
      formData.append('file', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'recording.m4a'
      } as any);
      formData.append('model', 'whisper-1');

      // Call OpenAI Whisper API
      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
        },
        body: formData,
      });

      const transcriptionResult = await transcriptionResponse.json();
      const transcribedText = transcriptionResult.text || '';
      
      console.log('TRANSCRIBED TEXT:');
      console.log('==================');
      console.log(transcribedText);
      console.log('==================');
      
      // Send transcription to endpoint and get response
      const response = await sendTranscriptionToEndpoint(transcribedText);
      
      // Add new conversation bubble
      const newBubble: ConversationBubble = {
        id: Date.now(),
        summary: response.summary || 'Conversation recorded',
        nextTopics: response.nextTopics || []
      };
      
      setConversationBubbles(prev => [...prev, newBubble]);
      
    } catch (error) {
      console.error('Transcription error:', error);
      
      // Fallback: simulate transcription for demo
      const simulatedText = `This is a simulated transcription. In a real implementation, this would be the actual transcribed speech from Whisper API.`;
      console.log('SIMULATED TRANSCRIPTION:');
      console.log(simulatedText);
      
      const response = await sendTranscriptionToEndpoint(simulatedText);
      
      const newBubble: ConversationBubble = {
        id: Date.now(),
        summary: response.summary || 'Conversation recorded',
        nextTopics: response.nextTopics || []
      };
      
      setConversationBubbles(prev => [...prev, newBubble]);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (userLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color={COLORS.maintext} />
          <Text style={styles.errorText}>Loading user...</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conversation with {user.name || `${user.firstName} ${user.lastName}`}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        
        {/* Conversation Bubbles */}
        <ScrollView style={styles.conversationArea} showsVerticalScrollIndicator={false}>
          {conversationBubbles.map((bubble) => (
            <View key={bubble.id} style={styles.conversationBubble}>
              <Text style={styles.summaryText}>{bubble.summary}</Text>
              
              {bubble.nextTopics.length > 0 && (
                <View style={styles.topicsContainer}>
                  <Text style={styles.topicsTitle}>Next conversation topics:</Text>
                  {bubble.nextTopics.map((topic, index) => (
                    <Text key={index} style={styles.topicText}>
                      {topic}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Recording Section */}
        <View style={styles.recordingSection}>
          {isRecording && (
            <Text style={styles.durationText}>{formatDuration(recordingDuration)}</Text>
          )}
          
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive,
              isProcessing && styles.recordButtonDisabled
            ]}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="large" color={COLORS.maintext} />
            ) : (
              <Text style={styles.recordButtonText}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Text>
            )}
          </TouchableOpacity>
          
          <Text style={styles.instructionText}>
            {isRecording 
              ? 'Recording... Tap to stop and transcribe'
              : isProcessing
                ? 'Processing your recording...'
                : 'Tap to record a conversation'
            }
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backText: {
    color: COLORS.accent,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
  },
  conversationArea: {
    flex: 1,
    paddingTop: 20,
    marginBottom: 20,
  },
  conversationBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.maintext,
    lineHeight: 24,
    marginBottom: 12,
  },
  topicsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
  },
  topicsTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.accent,
    marginBottom: 8,
  },
  topicText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.subtext,
    lineHeight: 20,
    marginBottom: 4,
  },
  recordingSection: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  durationText: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.accent,
    marginBottom: 16,
  },
  recordButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButtonActive: {
    backgroundColor: '#FF4444',
  },
  recordButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  recordButtonText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.background,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.subtext,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  errorText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
    textAlign: 'center',
  },
});
