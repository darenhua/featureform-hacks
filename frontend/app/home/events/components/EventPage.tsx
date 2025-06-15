import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { COLORS, FONTS } from "../../../styles/global";
import EventPageHeader from "./EventPageHeader";
import EventCard from "./EventCard";
import ProfileCard from "./ProfileCard";
import PeopleSection from "./PeopleSection";
import { mockPeople } from "../../mock-people";
import { Event } from "../../../api/events";

interface EventPageProps {
  event?: Event;
  isLoading?: boolean;
  error?: string | null;
}

export default function EventPage({ event, isLoading, error }: EventPageProps) {
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.profileScrollContent}
            style={styles.profileScrollContainer}
          >
            {mockPeople.map((person, index) => (
              <View key={person.id} style={styles.profileCardWrapper}>
                <ProfileCard
                  name={person.name}
                  image={person.image}
                  interests={person.interests}
                  colorIndex={index}
                  userId={person.userId}
                />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* People Section */}
        <PeopleSection
          title="People"
          categories={peopleCategories}
          eventId={event.id}
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
}); 