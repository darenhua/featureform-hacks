import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { COLORS, FONTS } from "../styles/global";
import { getVendorId } from "../../helper";
import { getUserByIdfv, User } from "../api/users";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const idfv = await getVendorId();
      if (!idfv) {
        console.error('Could not get device IDFV');
        setLoading(false);
        return;
      }

      // Try to find user by IDFV using the API function
      const currentUser = await getUserByIdfv(idfv);
      
      if (currentUser) {
        setUser(currentUser);
        console.log('Current user found:', currentUser);
      } else {
        console.log('Current user not found in database');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = () => {
    router.push("/profile/add-event");
  };

  const handlePastSparks = () => {
    router.push("/profile/past-sparks");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={
          user?.image_url 
            ? { uri: user.image_url }
            : require("../../assets/images/mock/gene.png")
        }
        style={styles.profileImage}
      />
      <Text style={styles.name}>
        {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User' : 'Gene Park'}
      </Text>
      
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
  loadingText: {
    color: COLORS.maintext,
    fontSize: 16,
    fontFamily: FONTS.medium,
    marginTop: 16,
  },
}); 