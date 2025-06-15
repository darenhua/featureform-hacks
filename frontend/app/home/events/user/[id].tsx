import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { COLORS, FONTS } from "../../../styles/global";
import { getUserById, User } from "../../../api/users";
import { mockPeople } from "../../mock-people";

export default function UserProfilePage() {
  const { id, eventId } = useLocalSearchParams();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    if (!id || typeof id !== 'string') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Try to get from backend API using the getUserById function
      const response = await getUserById(id);
      setUser(response.user);
      console.log('User fetched from API:', response.user);
    } catch (error) {
      // Fallback to mock data if API fails
      console.log('API failed, using mock data for user:', id);
      const mockUser = mockPeople.find(person => person.id === id || person.userId === id);
      if (mockUser) {
        // Transform mock user to match expected format
        setUser({
          id: mockUser.id,
          idfv: mockUser.userId, // Use userId as idfv for mock data
          firstName: mockUser.name.split(' ')[0],
          lastName: mockUser.name.split(' ').slice(1).join(' '),
          image_url: mockUser.image,
          long_description: mockUser.bio,
          interests: mockUser.interests,
          work_history: mockUser.workHistory
        } as User);
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color={COLORS.maintext} />
          <Text style={styles.loadingText}>Loading user...</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </View>
    );
  }

  const handleSparkUp = () => {
    // Use the actual user ID for spark-up navigation
    const sparkId = user.id;
    const url = eventId 
      ? `/home/events/user/spark-up/${sparkId}?eventId=${eventId}`
      : `/home/events/user/spark-up/${sparkId}`;
    router.push(url as any);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image 
            source={{ 
              uri: user.image_url || "https://randomuser.me/api/portraits/men/7.jpg" 
            }} 
            style={styles.profileImage} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>
              {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
            </Text>
            <Text style={styles.userBio}>
              {user.short_description || 'No bio available'}
            </Text>
            <TouchableOpacity style={styles.sparkButton} onPress={handleSparkUp}>
              <Text style={styles.sparkButtonText}>Spark up!</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Work History Section */}
        {user.work_history && Array.isArray(user.work_history) && user.work_history.length > 0 && (
          <View style={styles.workSection}>
            <Text style={styles.sectionTitle}>Work History</Text>
            {user.work_history.map((work: any, index: number) => (
              <View key={index} style={styles.workItem}>
                <View style={styles.workHeader}>
                  <Text style={styles.workTitle}>{work.title || 'Position'}</Text>
                  <Text style={styles.workDuration}>
                    {work.start_date && work.end_date 
                      ? `${work.start_date} - ${work.end_date}`
                      : work.duration || 'Duration not specified'
                    }
                  </Text>
                </View>
                <Text style={styles.workCompany}>{work.company || 'Company'}</Text>
                <Text style={styles.workDescription}>
                  {work.description || 'No description available'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Interests Section */}
        {user.interests && Array.isArray(user.interests) && user.interests.length > 0 && (
          <View style={styles.interestsSection}>
            <Text style={styles.sectionTitle}>Interests & Skills</Text>
            <View style={styles.interestsList}>
              {user.interests.map((interest: string, index: number) => (
                <Text key={index} style={styles.interestItem}>• {interest}</Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 28,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: COLORS.accent,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingBottom: 50,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 40,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginRight: 24,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
    marginBottom: 8,
  },
  userBio: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.subtext,
    lineHeight: 22,
    marginBottom: 20,
  },
  sparkButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  sparkButtonText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.background,
  },
  workSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
    marginBottom: 20,
  },
  workItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  workHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  workTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
    flex: 1,
    marginRight: 8,
  },
  workDuration: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.accent,
  },
  workCompany: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.brightBlue,
    marginBottom: 8,
  },
  workDescription: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.subtext,
    lineHeight: 20,
  },
  interestsSection: {
    marginBottom: 40,
  },
  interestsList: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
  },
  interestItem: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.subtext,
    lineHeight: 20,
    marginBottom: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  errorText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.subtext,
    marginTop: 12,
  },
});
