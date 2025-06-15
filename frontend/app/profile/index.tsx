import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, FONTS } from "../styles/global";

export default function Profile() {
  const router = useRouter();

  const handleAddEvent = () => {
    router.push("/profile/add-event");
  };

  const handlePastSparks = () => {
    router.push("/profile/past-sparks");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/mock/gene.png")}
        style={styles.profileImage}
      />
      <Text style={styles.name}>Gene Park</Text>
      
      <TouchableOpacity style={styles.addEventButton} onPress={handleAddEvent}>
        <Text style={styles.addEventText}>Add Event</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addEventButton} onPress={handlePastSparks}>
        <Text style={styles.addEventText}>Past Sparks</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  name: {
    color: COLORS.maintext,
    fontSize: 24,
    fontFamily: FONTS.bold,
    marginBottom: 32,
  },
  addEventButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addEventText: {
    color: COLORS.maintext,
    fontSize: 18,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
}); 