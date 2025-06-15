import React, { useState, useEffect, useRef } from "react";
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
import Constants from "expo-constants";
import { getVendorId } from "../../../../../helper";
import { getUserByIdfv, getUserById, User } from "../../../../api/users";
import { startConversation, continueConversation } from "../../../../api/conversation";

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
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [currentUserIdfv, setCurrentUserIdfv] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversationGroupId, setConversationGroupId] = useState<number | null>(null);
  const [conversationStarted, setConversationStarted] = useState(false);
  
  // Ref to track if initialization is in progress
  const initializingRef = useRef(false);
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

  // Start conversation when both users are loaded
  useEffect(() => {
    console.log('useEffect triggered - checking conversation initialization');
    console.log('currentUser:', !!currentUser);
    console.log('user:', !!user);
    console.log('currentUserId:', currentUserId);
    console.log('conversationStarted:', conversationStarted);
    console.log('conversationGroupId:', conversationGroupId);
    console.log('initializingRef.current:', initializingRef.current);
    
    if (currentUser && user && currentUserId && !conversationStarted && !conversationGroupId && !initializingRef.current) {
      console.log('All conditions met, initializing conversation...');
      initializeConversation();
    } else {
      console.log('Conditions not met for conversation initialization');
    }
  }, [currentUser?.id, user?.id, currentUserId]); // Only depend on IDs, not full objects

  const getCurrentUserIdfv = async () => {
    try {
      const idfv = await getVendorId();
      setCurrentUserIdfv(idfv);
      console.log('Current user IDFV:', idfv);
      
      // Get the actual user ID by looking up the IDFV
      if (idfv) {
        const currentUserData = await getUserByIdfv(idfv);
        if (currentUserData) {
          setCurrentUserId(currentUserData.id);
          setCurrentUser(currentUserData);
          console.log('Current user ID:', currentUserData.id);
          console.log('Current user data loaded');
        } else {
          console.log('Current user not found in database');
        }
      }
    } catch (error) {
      console.error('Failed to get current user IDFV/ID:', error);
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
    if (!id || typeof id !== 'string') {
      setUserLoading(false);
      return;
    }

    try {
      setUserLoading(true);
      // Try to get from backend API using getUserById
      const response = await getUserById(id);
      setUser(response.user);
      console.log('Spark-up user fetched from API:', response.user?.id);
    } catch (error) {
      // Fallback to mock data if API fails
      console.log('API failed, using mock data for spark-up user:', id);
      const mockUser = mockPeople.find(person => person.userId === id || person.id === id);
      if (mockUser) {
        // Transform mock user to match User interface
        const transformedUser: User = {
          id: mockUser.id,
          idfv: mockUser.userId, // Use userId as idfv for mock data
          firstName: mockUser.name.split(' ')[0],
          lastName: mockUser.name.split(' ').slice(1).join(' '),
          image_url: mockUser.image,
          long_description: mockUser.bio,
          interests: mockUser.interests,
          work_history: mockUser.workHistory
        };
        setUser(transformedUser);
        console.log('Using mock user for spark-up:', transformedUser.id);
      } else {
        setUser(null);
        console.log('No user found for ID:', id);
      }
    } finally {
      setUserLoading(false);
    }
  };

  const initializeConversation = async () => {
    // Add multiple guards to prevent duplicate calls
    if (!currentUser || !user || !eventId) {
      console.log('Missing required data for conversation initialization');
      return;
    }

    if (conversationStarted || conversationGroupId || initializingRef.current) {
      console.log('Conversation already started, in progress, or currently initializing');
      return;
    }

    try {
      console.log('=== STARTING CONVERSATION INITIALIZATION ===');
      console.log('Current user ID:', currentUser.id);
      console.log('Other user ID:', user.id);
      console.log('Event ID:', eventId);
      
      // Set flags immediately to prevent duplicate calls
      initializingRef.current = true;
      setConversationStarted(true);

      const startData = {
        person1Id: parseInt(currentUser.id),
        person2Id: parseInt(user.id),
        eventId: parseInt(eventId as string),
        dump1: currentUser.long_description || currentUser.short_description || 'No description available',
        dump2: user.long_description || user.short_description || 'No description available'
      };

      console.log('Calling startConversation API with data:', startData);
      const response = await startConversation(startData);
      setConversationGroupId(response.conversation_group_id);
      console.log('=== CONVERSATION STARTED SUCCESSFULLY ===');
      console.log('Conversation group ID:', response.conversation_group_id);
    } catch (error) {
      console.error('=== CONVERSATION START FAILED ===');
      console.error('Error details:', error);
      
      // Reset flags on error so user can try again
      setConversationStarted(false);
      setConversationGroupId(null);
      
      // Show alert but don't spam it
      Alert.alert('Notice', 'Conversation API unavailable, continuing in offline mode');
    } finally {
      // Always reset the ref flag
      initializingRef.current = false;
    }
  };

  const sendTranscriptionToEndpoint = async (transcription: string) => {
    try {
      if (conversationGroupId) {
        // Use the conversation API
        console.log('Sending transcription to conversation API...');
        const response = await continueConversation({
          conversation_group_id: conversationGroupId,
          transcript: transcription
        });
        
        // Parse topics from string to array if needed
        let topics: string[] = [];
        const rawTopics = response.new_topics || response.nextTopics;
        
        if (rawTopics) {
          if (typeof rawTopics === 'string') {
            // Split by bullet points, numbered lists, or line breaks
            topics = rawTopics
              .split(/\n|•|\d+\.|-/g)
              .map((topic: string) => topic.trim())
              .filter((topic: string) => topic.length > 0);
          } else if (Array.isArray(rawTopics)) {
            topics = rawTopics;
          }
        }
        
        // Fallback if no topics or parsing failed
        if (topics.length === 0) {
          topics = [
            "Tell me more about your experience with that",
            "What challenges did you face?",
            "How did that make you feel?"
          ];
        }
        
        return {
          summary: response.snippet_summary || response.summary || 'Conversation processed',
          nextTopics: topics
        };
      } else {
        // Fallback to mock response
        console.log('No conversation group ID, using mock response');
        return {
          summary: `You discussed: ${transcription.substring(0, 100)}${transcription.length > 100 ? '...' : ''}`,
          nextTopics: [
            "Tell me more about your experience with that",
            "What challenges did you face?",
            "How did that make you feel?"
          ]
        };
      }
    } catch (error) {
      console.error('Error sending transcription:', error);
      // Return mock response on error
      return {
        summary: `You discussed: ${transcription.substring(0, 100)}${transcription.length > 100 ? '...' : ''}`,
        nextTopics: [
          "Tell me more about your experience with that",
          "What challenges did you face?",
          "How did that make you feel?"
        ]
      };
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
      
      // Send transcription to conversation API
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
        summary: response.summary || 'Simulated conversation summary - this would be an AI-generated summary of your discussion',
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

  // Get display name from user data
  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : (user as any).name || 'User'; // Fallback for mock data

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conversation with {displayName}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        
        {/* Conversation Status */}
        {!conversationStarted && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="small" color={COLORS.accent} />
            <Text style={styles.statusText}>Initializing conversation...</Text>
          </View>
        )}

        {conversationGroupId && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Conversation ID: {conversationGroupId.toString().substring(0, 8)}...</Text>
          </View>
        )}
        
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.accent,
    marginLeft: 8,
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
