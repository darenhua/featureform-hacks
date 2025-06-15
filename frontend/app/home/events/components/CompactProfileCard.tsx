import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, FONTS } from "../../../styles/global";

interface CompactProfileCardProps {
  name: string;
  image: string;
  title: string;
  userId: string;
}

export default function CompactProfileCard({ name, image, title, userId }: CompactProfileCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/home/events/user/${userId}` as any);
  };

  const imageSource = typeof image === 'string' ? { uri: image } : image;

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.compactCard}>
        <Image source={imageSource} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileTitle}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  compactCard: {
    backgroundColor: "black",
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