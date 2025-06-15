import { TouchableOpacity, Text, StyleSheet, Image, View } from "react-native";
import { COLORS, FONTS } from "../app/styles/global";

interface EventCardProps {
  name: string;
  image: any; // require result
  onPress?: () => void;
}

export default function EventCard({ name, image, onPress }: EventCardProps) {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
      </View>
      <Text style={styles.label}>{name}</Text>
    </TouchableOpacity>
  );
}

const CARD_SIZE = 160;

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_SIZE,
    alignItems: "center",
  },
  imageContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  image: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 20,
    resizeMode: "cover",
  },
  label: {
    color: COLORS.maintext,
    fontSize: 15,
    fontWeight: "600",
    fontFamily: FONTS.bold,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 18,
    maxWidth: CARD_SIZE - 10,
  },
}); 