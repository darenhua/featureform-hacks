import React from "react";
import { View, Text, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { COLORS, FONTS } from "../../../styles/global";

interface CompactProfileCardProps {
  name: string;
  image: ImageSourcePropType;
  title: string;
  colorIndex: number;
}

const backgroundColors = [
  `#${COLORS.darkOrange}`,
  `#${COLORS.darkBlue}`,
  `#${COLORS.darkGreen}`,
  `#${COLORS.darkYellow}`,
];

export default function CompactProfileCard({ name, image, title, colorIndex }: CompactProfileCardProps) {
  const backgroundColor = backgroundColors[colorIndex % backgroundColors.length];

  return (
    <View style={[styles.compactCard, { backgroundColor }]}>
      <Image source={image} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileTitle}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  compactCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    width: 200,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.subtext,
    lineHeight: 16,
  },
}); 