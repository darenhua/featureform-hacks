import { Text, View, TextInput, TouchableOpacity, StyleSheet, Platform, Alert, ScrollView } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useState } from "react";
import { COLORS } from "../styles/global";
import onboarding, { OnboardingData } from "../api/onboarding";
import { getVendorId } from "../../helper";

const INTEREST_OPTIONS = [
  'Computer Science',
  'AI',
  'Entrepreneurship',
  'Software Engineering',
  'Data Science',
  'Machine Learning',
  'Web Development',
  'Mobile Development',
  'Cybersecurity',
  'Product Management',
  'Design',
  'Marketing',
  'Finance',
  'Consulting',
  'Research',
];

export default function Index() {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setResumeFile(result);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (!linkedinUrl.trim()) {
      Alert.alert('Error', 'Please enter your LinkedIn URL');
      return;
    }

    if (selectedInterests.length === 0) {
      Alert.alert('Error', 'Please select at least one interest');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the device IDFV
      const idfv = await getVendorId();
      if (!idfv) {
        Alert.alert('Error', 'Unable to get device identifier. Please try again.');
        return;
      }

      // Structure the data according to OnboardingData interface
      const onboardingData: OnboardingData = {
        linkedinURL: linkedinUrl.trim(),
        interests: selectedInterests,
        idfv: idfv,
      };

      // Add resume data if a file was uploaded
      if (resumeFile && !resumeFile.canceled && resumeFile.assets[0]) {
        const resume = resumeFile.assets[0];
        
        // Read file as base64
        const base64 = await FileSystem.readAsStringAsync(resume.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        onboardingData.resume = base64;
        onboardingData.resumeFileName = resume.name;
        onboardingData.resumeMimeType = resume.mimeType || 'application/pdf';
      }

      console.log('Submitting onboarding data with IDFV:', idfv);
      await onboarding(onboardingData);
      
      Alert.alert('Success', 'Your information has been submitted successfully!');

      // Reset form
      setLinkedinUrl('');
      setResumeFile(null);
      setSelectedInterests([]);

    } catch (error) {
      console.error('Error submitting onboarding data:', error);
      Alert.alert('Error', 'Failed to submit your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>LinkedIn URL</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your LinkedIn profile URL"
          value={linkedinUrl}
          onChangeText={setLinkedinUrl}
          autoCapitalize="none"
          keyboardType="url"
        />

        <Text style={styles.label}>Resume (Optional)</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickResume}>
          <Text style={styles.uploadButtonText}>
            {resumeFile && !resumeFile.canceled ? 'Resume Selected' : 'Upload Resume (Optional)'}
          </Text>
        </TouchableOpacity>
        {resumeFile && !resumeFile.canceled && (
          <Text style={styles.fileName}>{resumeFile.assets[0].name}</Text>
        )}

        <Text style={styles.label}>Interests</Text>
        <Text style={styles.sublabel}>Select all that apply:</Text>
        <View style={styles.interestsContainer}>
          {INTEREST_OPTIONS.map((interest) => (
            <TouchableOpacity
              key={interest}
              style={[
                styles.interestButton,
                selectedInterests.includes(interest) && styles.interestButtonSelected
              ]}
              onPress={() => toggleInterest(interest)}
            >
              <Text style={[
                styles.interestButtonText,
                selectedInterests.includes(interest) && styles.interestButtonTextSelected
              ]}>
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText} >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    padding: 20,
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: "white",
  },
  sublabel: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fileName: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 30,
  },
  interestButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  interestButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  interestButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  interestButtonTextSelected: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
