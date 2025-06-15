import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Audio } from 'expo-av';
import { COLORS, FONTS } from "../../../../styles/global";
import { mockPeople } from "../../../mock-people";

interface Message {
  id: string;
  type: 'summary' | 'suggestion' | 'system' | 'transcription';
  content: string;
  timestamp: Date;
  sender?: 'user' | 'partner' | 'ai';
  isProcessing?: boolean;
}

interface TranscriptionChunk {
  text: string;
  timestamp: number;
  confidence?: number;
}

export default function SparkUpConversationPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [fullTranscription, setFullTranscription] = useState<string>("");
  
  const user = mockPeople.find(person => person.userId === id);
  const recordingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptionTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioChunks = useRef<string[]>([]);

  useEffect(() => {
    setupAudio();
    addWelcomeMessage();
    
    return () => {
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
      if (transcriptionTimer.current) {
        clearInterval(transcriptionTimer.current);
      }
      stopRecording();
    };
  }, []);

  const setupAudio = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Microphone access is required for recording conversations.');
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

  const addWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: '1',
      type: 'system',
      content: `🎙️ Ready to start your Spark conversation with ${user?.name || 'your partner'}!\n\nI'll be listening throughout your entire conversation and providing:\n• Real-time transcription\n• Conversation insights\n• Topic suggestions\n\nTap "Start Conversation" when you're both ready to begin.`,
      timestamp: new Date(),
      sender: 'ai'
    };
    setMessages([welcomeMessage]);
  };

  const startConversation = async () => {
    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setConversationStarted(true);
      setRecordingDuration(0);
      
      // Start recording timer
      recordingTimer.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // Start transcription processing every 10 seconds
      transcriptionTimer.current = setInterval(() => {
        processAudioChunk();
      }, 10000);
      
      // Add system message
      addMessage({
        type: 'system',
        content: '🔴 Conversation started! I\'m now listening and will transcribe everything you say.',
        sender: 'ai'
      });
      
      console.log('🎙️ Continuous recording started - all speech will be transcribed');
      
    } catch (error) {
      console.error('Failed to start conversation:', error);
      Alert.alert('Recording Error', 'Unable to start conversation recording. Please check your microphone permissions and try again.');
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        
        // Get the recording URI and process final chunk
        const uri = recording.getURI();
        if (uri) {
          await transcribeAudioChunk(uri, true);
        }
        
        setRecording(null);
      }
      
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }
      
      if (transcriptionTimer.current) {
        clearInterval(transcriptionTimer.current);
        transcriptionTimer.current = null;
      }
      
      setIsRecording(false);
      
      console.log('🏁 Final transcription:', fullTranscription);
      console.log(`📊 Total conversation duration: ${formatDuration(recordingDuration)}`);
      
      // Add final summary
      addMessage({
        type: 'summary',
        content: `📋 Conversation Complete (${formatDuration(recordingDuration)})\n\n✨ Full transcription has been logged to console.\n\nKey insights and next steps will be generated based on your complete conversation.`,
        sender: 'ai'
      });
      
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const processAudioChunk = async () => {
    if (!recording) return;
    
    try {
      setIsTranscribing(true);
      
      // In a real implementation, you would:
      // 1. Get the current recording data
      // 2. Send it to Whisper API
      // 3. Process the transcription
      
      // For now, simulate getting the recording URI
      const uri = recording.getURI();
      if (uri) {
        await transcribeAudioChunk(uri, false);
      }
      
    } catch (error) {
      console.error('Error processing audio chunk:', error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const transcribeAudioChunk = async (audioUri: string, isFinal: boolean = false) => {
    try {
      // Simulate Whisper API call
      // In production, you would send the audio file to OpenAI Whisper API
      const transcriptionText = await callWhisperAPI(audioUri);
      
      // Log all transcription to console
      console.log(`🗣️ Transcription ${isFinal ? '(FINAL)' : '(CHUNK)'}:`, transcriptionText);
      
      // Update full transcription
      setFullTranscription(prev => prev + (prev ? ' ' : '') + transcriptionText);
      
      // Add transcription message to UI (optional, for demo)
      if (transcriptionText.trim()) {
        addMessage({
          type: 'transcription',
          content: `Transcribed: "${transcriptionText}"`,
          sender: 'ai'
        });
      }
      
      // Generate AI insights based on transcription
      if (transcriptionText.length > 50) {
        generateConversationInsights(transcriptionText);
      }
      
    } catch (error) {
      console.error('Transcription error:', error);
    }
  };

  const callWhisperAPI = async (audioUri: string): Promise<string> => {
    // Simulate Whisper API call
    // In production, replace with actual OpenAI Whisper API call
    
    const simulatedTranscriptions = [
      "Hi there, nice to meet you!",
      "I'm really excited about this project we're discussing.",
      "What's your experience with AI and machine learning?",
      "That's fascinating, I'd love to collaborate on something similar.",
      "Have you worked with any startups before?",
      "This could be a great opportunity for both of us.",
      "Let's definitely stay in touch and explore this further.",
    ];
    
    // Return random simulated transcription for demo
    const randomText = simulatedTranscriptions[Math.floor(Math.random() * simulatedTranscriptions.length)];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return randomText;
    
    // Real Whisper API implementation would look like:
    /*
    const formData = new FormData();
    formData.append('file', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'audio.m4a'
    } as any);
    formData.append('model', 'whisper-1');
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });
    
    const result = await response.json();
    return result.text || '';
    */
  };

  const generateConversationInsights = (recentTranscription: string) => {
    // Generate AI insights based on the transcription
    const insights = analyzeConversationContent(recentTranscription);
    
    if (insights) {
      addMessage({
        type: 'summary',
        content: insights,
        sender: 'ai'
      });
    }
  };

  const analyzeConversationContent = (text: string): string | null => {
    // Simple keyword-based analysis for demo
    const keywords = {
      startup: "I'm detecting entrepreneurship discussion! 🚀",
      project: "You're talking about projects - great collaboration potential! 💡",
      AI: "AI and machine learning topic detected! 🤖",
      experience: "Sharing experiences - this builds great connections! 🤝",
      collaborate: "Collaboration opportunity mentioned! This could be exciting! ✨"
    };
    
    for (const [keyword, insight] of Object.entries(keywords)) {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        return insight;
      }
    }
    
    return null;
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      ...messageData
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleBack = () => {
    if (isRecording) {
      Alert.alert(
        'Conversation in Progress',
        'Your conversation is being recorded. End the conversation before leaving?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'End & Leave', 
            style: 'destructive',
            onPress: async () => {
              await stopRecording();
              router.back();
            }
          }
        ]
      );
    } else {
      router.back();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMessage = (message: Message) => {
    const isAI = message.sender === 'ai';
    
    return (
      <View key={message.id} style={styles.messageContainer}>
        <View style={[
          styles.messageBubble,
          isAI ? styles.aiBubble : styles.userBubble,
          message.type === 'suggestion' && styles.suggestionBubble,
          message.type === 'summary' && styles.summaryBubble,
          message.type === 'transcription' && styles.transcriptionBubble
        ]}>
          {message.type === 'suggestion' && (
            <Text style={styles.messageLabel}>💡 Conversation Suggestions</Text>
          )}
          {message.type === 'summary' && (
            <Text style={styles.messageLabel}>📝 Live Insights</Text>
          )}
          {message.type === 'system' && (
            <Text style={styles.messageLabel}>🤖 AI Assistant</Text>
          )}
          {message.type === 'transcription' && (
            <Text style={styles.messageLabel}>🗣️ Live Transcription</Text>
          )}
          
          <Text style={[
            styles.messageText,
            isAI ? styles.aiMessageText : styles.userMessageText
          ]}>
            {message.content}
          </Text>
          
          <Text style={styles.timestamp}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

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
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Spark with {user.name}</Text>
          {isRecording && (
            <Text style={styles.recordingIndicator}>
              🔴 LIVE {formatDuration(recordingDuration)}
            </Text>
          )}
          {isTranscribing && (
            <Text style={styles.transcribingIndicator}>
              🎤 Transcribing...
            </Text>
          )}
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      {/* Conversation Controls */}
      <View style={styles.controlsContainer}>
        {!conversationStarted ? (
          <TouchableOpacity style={styles.startButton} onPress={startConversation}>
            <Text style={styles.startButtonText}>Start Conversation</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.endButton} onPress={stopRecording}>
            <Text style={styles.endButtonText}>End Conversation</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.statusText}>
          {!conversationStarted 
            ? 'Ready to begin continuous recording' 
            : isRecording 
              ? 'Recording continuously - all speech being transcribed'
              : 'Conversation ended'
          }
        </Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: COLORS.accent,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
    textAlign: 'center',
  },
  recordingIndicator: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: '#FF4444',
    marginTop: 2,
  },
  transcribingIndicator: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.accent,
    marginTop: 1,
  },
  headerRight: {
    width: 60,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 20,
    paddingBottom: 120,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageBubble: {
    maxWidth: '90%',
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  aiBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: COLORS.brightBlue,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  suggestionBubble: {
    backgroundColor: `#${COLORS.darkGreen}`,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  summaryBubble: {
    backgroundColor: `#${COLORS.darkBlue}`,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  transcriptionBubble: {
    backgroundColor: `#${COLORS.darkYellow}`,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  messageLabel: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: COLORS.accent,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    lineHeight: 22,
  },
  aiMessageText: {
    color: COLORS.maintext,
  },
  userMessageText: {
    color: COLORS.maintext,
  },
  timestamp: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: COLORS.subtext,
    marginTop: 8,
    opacity: 0.7,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.background,
  },
  endButton: {
    backgroundColor: '#FF4444',
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  endButtonText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
  },
  statusText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.subtext,
    textAlign: 'center',
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
