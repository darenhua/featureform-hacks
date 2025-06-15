import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { COLORS, FONTS } from "../styles/global";

export default function AddEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
    description: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter an event name");
      return;
    }
    if (!formData.location.trim()) {
      Alert.alert("Error", "Please enter a location");
      return;
    }
    if (!formData.date.trim()) {
      Alert.alert("Error", "Please enter a date");
      return;
    }
    if (!formData.time.trim()) {
      Alert.alert("Error", "Please enter a time");
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    // Here you would normally save the event to your backend/database
    console.log("Event data:", formData);
    
    Alert.alert(
      "Success", 
      "Event created successfully!",
      [
        {
          text: "OK",
          onPress: () => router.back()
        }
      ]
    );
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Event</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Enter event name"
            placeholderTextColor={COLORS.subtext}
          />
        </View>

        {/* Location */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            placeholder="Enter location"
            placeholderTextColor={COLORS.subtext}
          />
        </View>

        {/* Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date *</Text>
          <TextInput
            style={styles.input}
            value={formData.date}
            onChangeText={(value) => handleInputChange('date', value)}
            placeholder="MM/DD/YYYY"
            placeholderTextColor={COLORS.subtext}
          />
        </View>

        {/* Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time *</Text>
          <TextInput
            style={styles.input}
            value={formData.time}
            onChangeText={(value) => handleInputChange('time', value)}
            placeholder="HH:MM AM/PM"
            placeholderTextColor={COLORS.subtext}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Enter event description"
            placeholderTextColor={COLORS.subtext}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Create Event Button */}
        <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
          <Text style={styles.createButtonText}>Create Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60, // Match other pages' padding
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 20,
    marginBottom: 30,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    color: COLORS.subtext,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.extraBold, // Remove fontWeight as it's handled by fontFamily
    color: COLORS.accent, // Use accent color like other page titles
  },
  saveButton: {
    padding: 8,
  },
  saveText: {
    color: COLORS.accent,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.maintext,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.08)", // Semi-transparent white like other cards
    borderRadius: 20, // Match the rounded corner style of other components
    padding: 16,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.maintext,
    borderWidth: 0, // Remove border for cleaner look like other components
  },
  textArea: {
    height: 100,
    paddingTop: 16,
    textAlignVertical: "top",
  },
  createButton: {
    backgroundColor: COLORS.brightBlue, // Use brightBlue like the profile card
    borderRadius: 20, // Match the rounded corner style
    padding: 18,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000", // Add shadow like EventCard
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createButtonText: {
    color: COLORS.maintext,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
}); 