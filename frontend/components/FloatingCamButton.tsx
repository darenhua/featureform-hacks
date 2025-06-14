import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface FloatingCamButtonProps {
  onPress?: () => void;
}

export default function FloatingCamButton({ onPress }: FloatingCamButtonProps) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Text style={styles.fabText}>Cam</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: "#fff",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: "#162955",
    fontSize: 20,
    fontWeight: "bold",
  },
}); 