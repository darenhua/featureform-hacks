import React from "react";
import { View, Text, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { COLORS, FONTS } from "../../../styles/global";

interface EventCardProps {
  name: string;
  image: ImageSourcePropType;
  description?: string;
  location?: string;
  date?: string;
  time?: string;
}

export default function EventCard({ name, image, description, location, date, time }: EventCardProps) {
  return (
    <View style={styles.eventCard}>
      <View style={styles.eventImageContainer}>
        <Image source={image} style={styles.eventImage} />
        <View style={styles.eventOverlay}>
          <Text style={styles.eventTitle}>
            {name === "Featureform 2025" ? "MCP\nHackathon" : name}
          </Text>
          
          {/* Event Details */}
          <View style={styles.eventDetails}>
            {location && (
              <Text style={styles.detailText}>{location}</Text>
            )}
            {date && (
              <Text style={styles.detailText}>{date}</Text>
            )}
            {time && (
              <Text style={styles.detailText}>{time}</Text>
            )}
          </View>

          {description && (
            <Text style={styles.eventDescriptionOverlay}>
              {description}
            </Text>
          )}
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
    paddingVertical: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  eventTitle: {
    fontSize: 28,
    fontFamily: FONTS.extraBold,
    color: COLORS.maintext,
    marginBottom: 12,
    lineHeight: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  eventDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.subtext,
    marginBottom: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  eventDescriptionOverlay: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.maintext,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
}); 