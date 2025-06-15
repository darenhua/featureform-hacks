import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Audio } from 'expo-av';
import { COLORS, FONTS } from "../../../../styles/global";
import { mockPeople } from "../../../mock-people";

interface ConversationResponse {
  summary?: string;
  suggestions?: string[];
}

export default function SparkUpConversationPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentResponse, setCurrentResponse] = useState<ConversationResponse | null>(null);
  const [topicCount, setTopicCount] = useState(0);
  
  const user = mockPeople.find(person => person.userId === id);
  let durationInterval: NodeJS.Timeout;

  useEffect(() => {
    setupAudio();
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

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

  const startRecording = async () => {
    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);
      setCurrentResponse(null);
      
      // Start duration timer
      durationInterval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      console.log('🎙️ Recording started for new topic');
      
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
        console.log(`🎯 Topic ${topicCount + 1} recorded (${formatDuration(recordingDuration)})`);
        
        // Send to backend for transcription
        await transcribeAndProcess(uri);
        setTopicCount(prev => prev + 1);
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
      
      console.log('📝 TRANSCRIBED TEXT:');
      console.log('==================');
      console.log(transcribedText);
      console.log('==================');
      
      // Generate response and suggestions
      await generateConversationResponse(transcribedText);
      
    } catch (error) {
      console.error('Transcription error:', error);
      
      // Fallback: simulate transcription for demo
      const simulatedText = `This is a simulated transcription for topic ${topicCount + 1}. In a real implementation, this would be the actual transcribed speech from Whisper API.`;
      console.log('📝 SIMULATED TRANSCRIPTION:');
      console.log(simulatedText);
      
      await generateConversationResponse(simulatedText);
    }
  };

  const generateConversationResponse = async (transcribedText: string) => {
    try {
      // Generate summary and suggestions based on transcribed text
      const summary = `Topic ${topicCount + 1}: ${transcribedText.substring(0, 100)}${transcribedText.length > 100 ? '...' : ''}`;
      
      const suggestions = [
        "Tell me more about your experience with that",
        "What challenges did you face?", 
        "How did that make you feel?",
        "What would you do differently next time?"
      ];
      
      setCurrentResponse({
        summary,
        suggestions: suggestions.slice(0, 2) // Show 2 suggestions
      });
      
    } catch (error) {
      console.error('Error generating response:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Spark with {user.name}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        
        {/* Topic Counter */}
        <View style={styles.topicCounter}>
          <Text style={styles.topicText}>Topic {topicCount + 1}</Text>
          {isRecording && (
            <Text style={styles.durationText}>{formatDuration(recordingDuration)}</Text>
          )}
        </View>

        {/* Recording Button */}
        <View style={styles.recordingSection}>
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
                : 'Tap to record a conversation topic'
            }
          </Text>
        </View>

        {/* Response Section */}
        {currentResponse && (
          <View style={styles.responseSection}>
            <Text style={styles.responseTitle}>💬 AI Response</Text>
            
            {currentResponse.summary && (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>{currentResponse.summary}</Text>
              </View>
            )}
            
            {currentResponse.suggestions && (
              <View style={styles.suggestionsBox}>
                <Text style={styles.suggestionsTitle}>💡 Conversation Starters:</Text>
                {currentResponse.suggestions.map((suggestion, index) => (
                  <Text key={index} style={styles.suggestionText}>
                    • {suggestion}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Topics Completed */}
        {topicCount > 0 && (
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>
              {topicCount} topic{topicCount !== 1 ? 's' : ''} recorded
            </Text>
          </View>
        )}
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
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
  },
  topicCounter: {
    alignItems: 'center',
    marginBottom: 40,
  },
  topicText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
  },
  durationText: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.accent,
    marginTop: 8,
  },
  recordingSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  recordButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
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
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.background,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.subtext,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  responseSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  responseTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.accent,
    marginBottom: 16,
  },
  summaryBox: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: COLORS.maintext,
    lineHeight: 22,
  },
  suggestionsBox: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: 16,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.accent,
    marginBottom: 12,
  },
  suggestionText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: COLORS.maintext,
    lineHeight: 22,
    marginBottom: 8,
  },
  progressSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  progressText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.subtext,
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
