import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="Go to Onboarding" 
          onPress={() => router.push("/onboarding")} 
        />
        <View style={styles.spacer} />
        <Button 
          title="Go to Home" 
          onPress={() => router.push("/home")} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  spacer: {
    height: 20,
  },
});