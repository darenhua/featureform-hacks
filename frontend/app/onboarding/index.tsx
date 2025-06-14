import { Text, View, TextInput, TouchableOpacity, StyleSheet, Platform } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { useState } from "react";
import { COLORS } from "../styles/global";

export default function Index() {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);

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

  return (
    <View style={styles.container}>
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

        <Text style={styles.label}>Resume</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={pickResume}>
          <Text style={styles.uploadButtonText}>
            {resumeFile && !resumeFile.canceled ? 'Resume Selected' : 'Upload Resume'}
          </Text>
        </TouchableOpacity>
        {resumeFile && !resumeFile.canceled && (
          <Text style={styles.fileName}>{resumeFile.assets[0].name}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: "white",
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
  },
});
