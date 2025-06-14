import { Link } from "expo-router";
import { TouchableOpacity, Image, StyleSheet, ViewStyle } from "react-native";

interface ProfileButtonProps {
  imageUri: string;
  containerStyle?: ViewStyle;
}

export default function ProfileButton({ imageUri, containerStyle }: ProfileButtonProps) {
  return (
    <Link href="/profile" asChild>
      <TouchableOpacity style={[styles.container, containerStyle]}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
}); 