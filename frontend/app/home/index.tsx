import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { COLORS, FONTS } from "../styles/global";
import EventCard from "../../components/EventCard";
import ProfileButton from "../../components/ProfileButton";
import FloatingCamButton from "../../components/FloatingCamButton";
import { mockEvents } from "./mock";

export default function Home() {
  const [events, setEvents] = useState(mockEvents);
  const router = useRouter();

  useEffect(() => {
    // You can add any data fetching logic here if needed
    // For now, we're using the mock data directly
  }, []);

  const handleEventPress = (eventId: string) => {
    console.log('Navigating to event:', eventId); // Debug log
    router.push(`/home/events/${eventId}` as any);
  };

  // Helper function to chunk events into pairs for rows
  const chunkEvents = (events: typeof mockEvents, chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < events.length; i += chunkSize) {
      chunks.push(events.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const eventRows = chunkEvents(events, 2);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Spark</Text>
        <ProfileButton imageUri={require("../../assets/images/mock/gene.png")} />
      </View>

      {/* Events Grid */}
      <ScrollView 
        style={styles.gridWrapper}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {eventRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((event) => (
              <EventCard 
                key={event.id} 
                name={event.name} 
                image={event.image} 
                onPress={() => handleEventPress(event.id)} 
              />
            ))}
            {/* Add spacer if row has only one event to maintain layout */}
            {row.length === 1 && <View style={styles.eventSpacer} />}
          </View>
        ))}
      </ScrollView>

      {/* Floating Cam Button */}
      <View style={styles.fabWrapper}>
        <FloatingCamButton />
      </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 20,
    paddingHorizontal: 28,
  },
  logo: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: FONTS.extraBold,
    color: COLORS.accent,
  },
  gridWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 120,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  eventSpacer: {
    width: 160, // Same width as EventCard to maintain spacing
  },
  fabWrapper: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
});