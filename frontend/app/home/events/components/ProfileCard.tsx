import React from "react";
import { View, Text, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { COLORS, FONTS } from "../../../styles/global";

interface ProfileCardProps {
  name: string;
  image: ImageSourcePropType;
  interests: string[];
  colorIndex: number;
}

const accentColors = [
  `#${COLORS.darkOrange}`,
  `#${COLORS.darkBlue}`,
  `#${COLORS.darkGreen}`,
  `#${COLORS.darkYellow}`,
];

export default function ProfileCard({ name, image, interests, colorIndex }: ProfileCardProps) {
  const accentColor = accentColors[colorIndex % accentColors.length];

  return (
    <View style={[styles.profileCard, { borderLeftColor: accentColor }]}>
      <Image source={image} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{name}</Text>
        <View style={styles.interestsList}>
          {interests.map((interest, index) => (
            <Text key={index} style={styles.interestItem}>• {interest}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: "#0F2A65",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 8,
  },
  profileImage: {
    width: 100,
    height: 100,
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
    color: COLORS.subtext,
    lineHeight: 18,
  },
}); 