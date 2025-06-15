import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { COLORS, FONTS } from "../../../styles/global";
import EventPageHeader from "./EventPageHeader";
import EventCard from "./EventCard";
import ProfileCard from "./ProfileCard";
import PeopleSection from "./PeopleSection";
import { Event } from "../../../api/events";
import { getAllUsers, User } from "../../../api/users";
import { getVendorId } from "../../../../helper";

interface EventPageProps {
  event?: Event;
  isLoading?: boolean;
  error?: string | null;
}

export default function EventPage({ event, isLoading, error }: EventPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [currentUserIdfv, setCurrentUserIdfv] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUserIdfv();
    fetchUsers();
  }, []);

  const getCurrentUserIdfv = async () => {
    try {
      const idfv = await getVendorId();
      setCurrentUserIdfv(idfv);
      console.log('Current user IDFV for filtering:', idfv);
    } catch (error) {
      console.error('Failed to get current user IDFV:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await getAllUsers();
      // Filter users that have been processed (completed onboarding)
      const processedUsers = response.users.filter(user => user.processed === true);
      setUsers(processedUsers);
      console.log(`Fetched ${processedUsers.length} processed users for event page`);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsersError('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  // Filter out current user from the list
  const getFilteredUsers = () => {
    if (!currentUserIdfv) return users;
    return users.filter(user => user.idfv !== currentUserIdfv);
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <EventPageHeader />
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <EventPageHeader />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
        </View>
      </View>
    );
  }

  // If event not found, show error state
  if (!event) {
    return (
      <View style={styles.container}>
        <EventPageHeader />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Event not found</Text>
          <Text style={styles.errorSubtext}>
            The event you&apos;re looking for doesn&apos;t exist or has been removed.
          </Text>
        </View>
      </View>
    );
  }

  const peopleCategories = [
    { name: "Entrepreneurship", count: 4 },
    { name: "Artificial Intelligence", count: 4 },
    { name: "Product Design", count: 4 }
  ];

  const filteredUsers = getFilteredUsers();

  return (
    <View style={styles.container}>
      <EventPageHeader />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Card */}
        <EventCard
          name={event.name}
          image={event.image_url ? { uri: event.image_url } : require("../../../../assets/images/mock/black.png")}
          description={event.description}
          location={event.location}
          date={event.date}
          time={event.time}
        />

        {/* Spark it up Section */}
        <View style={styles.sparkSection}>
          <Text style={styles.sectionTitle}>Spark it up!</Text>
          {usersLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.accent} />
              <Text style={styles.loadingText}>Loading users...</Text>
            </View>
          ) : usersError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error loading users</Text>
              <Text style={styles.errorSubtext}>{usersError}</Text>
            </View>
          ) : filteredUsers.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>No other users available</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.profileScrollContent}
              style={styles.profileScrollContainer}
            >
              {filteredUsers.slice(0, 10).map((user, index) => (
                <View key={user.id} style={styles.profileCardWrapper}>
                  <ProfileCard
                    name={`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
                    image={user.image_url || "https://randomuser.me/api/portraits/men/7.jpg"}
                    interests={user.interests || []}
                    colorIndex={index}
                    userId={user.id}
                    eventId={event.id}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* People Section */}
        <PeopleSection
          title="People"
          categories={peopleCategories}
          eventId={event.id}
          currentUserIdfv={currentUserIdfv}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  sparkSection: {
    marginBottom: 40,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
    marginBottom: 20,
    paddingHorizontal: 28,
  },
  profileScrollContainer: {
    paddingLeft: 28,
  },
  profileScrollContent: {
    paddingRight: 28,
  },
  profileCardWrapper: {
    marginRight: 16,
    width: 300,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  errorText: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.maintext,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.subtext,
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 28,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.subtext,
    marginTop: 12,
  },
}); 