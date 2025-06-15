import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "./styles/global";
import { useEffect } from "react";
import axios from "axios";
import { getVendorId } from "../helper";
import Constants from "expo-constants";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const create_user = async () => {
      const idfv = await getVendorId();
      console.log("IDFV:", idfv);
      axios
        .post("https://featureform-hacks.onrender.com/user", {
          idfv
        })
        .then((response) => console.log(response.data))
        .catch((error) => console.error("Error fetching data:", error));
    };

    create_user();
    console.log("MY_SECRET:", Constants.expoConfig?.extra?.NODE_URL);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Onboarding"
          onPress={() => router.push("/onboarding")}
        />
        <View style={styles.spacer} />
        <Button title="Go to Home" onPress={() => router.push("/home")} />
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
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: "bold",
    color: "white",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  spacer: {
    height: 20,
  },
});

