import { Link } from "expo-router";
import { TouchableOpacity, Image, StyleSheet, ViewStyle, ImageSourcePropType } from "react-native";

interface ProfileButtonProps {
  imageUri: string | ImageSourcePropType;
  containerStyle?: ViewStyle;
}

export default function ProfileButton({ imageUri, containerStyle }: ProfileButtonProps) {
  const source = typeof imageUri === "string" ? { uri: imageUri } : (imageUri as ImageSourcePropType);
  return (
    <Link href="/profile" asChild>
      <TouchableOpacity style={[styles.container, containerStyle]}>
        <Image source={source} style={styles.image} />
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
    width: 48,
    height: 48,
    borderRadius: 30,
  },
}); 