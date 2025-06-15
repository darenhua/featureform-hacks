import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, FONTS } from "../../../styles/global";

interface ProfileCardProps {
  name: string;
  image: string;
  interests: string[];
  colorIndex: number;
  userId: string;
}

const accentColors = [
  `#${COLORS.darkOrange}`,
  `#${COLORS.darkBlue}`,
  `#${COLORS.darkGreen}`,
  `#${COLORS.darkYellow}`,
];

export default function ProfileCard({ name, image, interests, colorIndex, userId }: ProfileCardProps) {
  const router = useRouter();
  const accentColor = accentColors[colorIndex % accentColors.length];

  const handlePress = () => {
    router.push(`/home/events/user/${userId}` as any);
  };

  const imageSource = typeof image === 'string' ? { uri: image } : image;

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.profileCard, { borderLeftColor: accentColor }]}>
        <Image source={imageSource} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{name}</Text>
          <View style={styles.interestsList}>
            {interests.map((interest, index) => (
              <Text key={index} style={styles.interestItem}>• {interest}</Text>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: "black",
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