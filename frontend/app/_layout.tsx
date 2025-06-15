import { Stack } from "expo-router";
import { View } from "react-native";
import useFonts from "../hooks/useFonts";

export default function RootLayout() {
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return <View />; // or a loading spinner
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
