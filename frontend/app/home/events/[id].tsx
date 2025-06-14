import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { COLORS, FONTS } from "../../styles/global";
import { mockEvents } from "../mock";

export default function EventPage() {
  const { id } = useLocalSearchParams();
  console.log('Event ID received:', id); // Debug log
  console.log('Available events:', mockEvents.map(e => ({ id: e.id, name: e.name }))); // Debug log
  const event = mockEvents.find(e => e.id === id);
  console.log('Found event:', event); // Debug log

  // If event not found, show error state
  if (!event) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Link href="/home" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </Link>
          <Text style={styles.logo}>Spark</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.errorText}>Event not found</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Link href="/home" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.logo}>Spark</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Card */}
        <View style={styles.eventCard}>
          <View style={styles.eventImageContainer}>
            <Image 
              source={event.image} 
              style={styles.eventImage}
            />
            <View style={styles.eventOverlay}>
              <Text style={styles.eventTitle}>
                {event.name === "Featureform 2025" ? "MCP\nHackathon" : event.name}
              </Text>
              <Text style={styles.eventSponsors}>Sponsored by</Text>
              <View style={styles.sponsorLogos}>
                <Text style={styles.sponsorText}>featureform</Text>
                <Text style={styles.sponsorText}>RIDGE</Text>
              </View>
            </View>
          </View>
          <View style={styles.eventDetails}>
            <Text style={styles.eventSubtitle}>{event.name}</Text>
            <Text style={styles.eventDescription}>
              {event.name === "Featureform 2025" 
                ? "This is a networking event at Ridge Ventures featuring a MCP hackathon"
                : `Join us for ${event.name} - a great networking opportunity to connect with like-minded professionals.`
              }
            </Text>
          </View>
        </View>

        {/* Spark it up Section */}
        <View style={styles.sparkSection}>
          <Text style={styles.sectionTitle}>Spark it up!</Text>
          <View style={styles.profileCard}>
            <Image 
              source={require("../../../assets/images/mock/gene.png")} 
              style={styles.profileImage} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Gene Park</Text>
              <View style={styles.interestsList}>
                <Text style={styles.interestItem}>• Made a project on music and sports</Text>
                <Text style={styles.interestItem}>• Interested in Entrepreneurship</Text>
                <Text style={styles.interestItem}>• Made an education app</Text>
              </View>
            </View>
          </View>
        </View>

        {/* People Section */}
        <View style={styles.peopleSection}>
          <Text style={styles.sectionTitle}>People</Text>
          
          <Text style={styles.categoryTitle}>Entrepreneurship</Text>
          <View style={styles.peoplePlaceholders}>
            <View style={styles.personPlaceholder} />
            <View style={styles.personPlaceholder} />
            <View style={styles.personPlaceholder} />
          </View>

          <Text style={styles.categoryTitle}>Artificial Intelligence</Text>
          <View style={styles.peoplePlaceholders}>
            <View style={styles.personPlaceholder} />
            <View style={styles.personPlaceholder} />
            <View style={styles.personPlaceholder} />
          </View>
        </View>
      </ScrollView>
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
    paddingTop: 20,
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: COLORS.maintext,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  logo: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: FONTS.extraBold,
    color: COLORS.accent,
  },
  headerSpacer: {
    width: 50, // Balance the header
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  eventCard: {
    marginBottom: 40,
  },
  eventImageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  eventImage: {
    width: "100%",
    height: 280,
    borderRadius: 20,
    resizeMode: "cover",
  },
  eventOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  eventTitle: {
    fontSize: 32,
    fontFamily: FONTS.extraBold,
    color: COLORS.maintext,
    marginBottom: 8,
    lineHeight: 36,
  },
  eventSponsors: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.subtext,
    marginBottom: 4,
  },
  sponsorLogos: {
    flexDirection: "row",
    gap: 12,
  },
  sponsorText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
  },
  eventDetails: {
    paddingHorizontal: 4,
  },
  eventSubtitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.subtext,
    lineHeight: 22,
  },
  sparkSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: "#6366F1", // Purple background like in screenshot
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
    marginBottom: 12,
  },
  interestsList: {
    gap: 4,
  },
  interestItem: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.maintext,
    lineHeight: 18,
  },
  peopleSection: {
    marginBottom: 40,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.subtext,
    marginBottom: 16,
    marginTop: 20,
  },
  peoplePlaceholders: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  personPlaceholder: {
    flex: 1,
    height: 100,
    backgroundColor: "#E5E7EB", // Light gray placeholders
    borderRadius: 16,
  },
  errorText: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.maintext,
  },
}); 