import React from "react";
import { View, Text, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { COLORS, FONTS } from "../../../styles/global";

interface EventCardProps {
  name: string;
  image: ImageSourcePropType;
  description?: string;
}

export default function EventCard({ name, image, description }: EventCardProps) {
  return (
    <View style={styles.eventCard}>
      <View style={styles.eventImageContainer}>
        <Image source={image} style={styles.eventImage} />
        <View style={styles.eventOverlay}>
          <Text style={styles.eventTitle}>
            {name === "Featureform 2025" ? "MCP\nHackathon" : name}
          </Text>
          <Text style={styles.eventSponsors}>Sponsored by</Text>
          <View style={styles.sponsorLogos}>
            <Text style={styles.sponsorText}>featureform</Text>
            <Text style={styles.sponsorText}>RIDGE</Text>
          </View>
          <Text style={styles.eventDescriptionOverlay}>
            {description || "This is a networking event at Ridge Ventures featuring a MCP hackathon"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    marginBottom: 40,
  },
  eventImageContainer: {
    position: "relative",
    marginBottom: 20,
    width: "100%",
    aspectRatio: 1,
  },
  eventImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    resizeMode: "cover",
  },
  eventOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  eventTitle: {
    fontSize: 32,
    fontFamily: FONTS.extraBold,
    color: COLORS.maintext,
    marginBottom: 8,
    lineHeight: 36,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  eventSponsors: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.subtext,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sponsorLogos: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  sponsorText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  eventDescriptionOverlay: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.maintext,
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 