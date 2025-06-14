import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface EventCardProps {
  name: string;
  onPress?: () => void;
}

export default function EventCard({ name, onPress }: EventCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardText}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#253A6D",
    borderRadius: 20,
    width: 150,
    height: 150,
    margin: 12,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    padding: 16,
  },
  cardText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
}); 