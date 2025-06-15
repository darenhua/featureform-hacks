import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { COLORS, FONTS } from "../styles/global";
import EventCard from "../../components/EventCard";
import ProfileButton from "../../components/ProfileButton";
import FloatingCamButton from "../../components/FloatingCamButton";
import { getAllEvents, joinEvent, Event } from "../api/events";
import { getVendorId } from "../../helper";
import axios from "axios";
import Constants from "expo-constants";
const NODE_URL = Constants.expoConfig?.extra?.NODE_URL;

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        //Fetch all events and set them to the events state
        const response = await getAllEvents();
        setEvents(response.events || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventPress = async (eventId: string) => {
    try {
      // Get the vendor ID from the device --> This is out way of identifying the user
      const vendorId = await getVendorId();

      if (vendorId) {
        // Join the event by adding user to the users array
        axios({
          method: "post",
          url: `${NODE_URL}/event/${eventId}/${vendorId}`,
        })
          .then((response) => {
            // console.log(response.data)
          })
          .catch((error) => console.log(error));
        // console.log('User joined event:', eventId);
      } else {
        console.warn("Could not get vendor ID");
      }
    } catch (error) {
      console.error("Error joining event:", error);
      // Continue to navigate even if join fails
    }

    // Navigate to the event page
    // console.log("Navigating to event:", eventId);
    router.push(`/home/events/${eventId}` as any);
  };

  // Helper function to chunk events into pairs for rows
  const chunkEvents = (events: Event[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < events.length; i += chunkSize) {
      chunks.push(events.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const eventRows = chunkEvents(events, 2);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Spark</Text>
        <ProfileButton
          imageUri={require("../../assets/images/mock/gene.png")}
        />
      </View>

      {/* Events Grid */}
      <ScrollView
        style={styles.gridWrapper}
        contentContainerStyle={[
          styles.scrollContent,
          events.length === 0 && styles.centerContent,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {events.length === 0 ? (
          <Text style={styles.noEventsText}>No events found</Text>
        ) : (
          eventRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((event) => (
                <EventCard
                  key={event.id}
                  name={event.name}
                  image={
                    event.image_url
                      ? { uri: event.image_url }
                      : require("../../assets/images/mock/screenshot1.png")
                  }
                  onPress={() => handleEventPress(event.id)}
                />
              ))}
              {/* Add spacer if row has only one event to maintain layout */}
              {row.length === 1 && <View style={styles.eventSpacer} />}
            </View>
          ))
        )}
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
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: COLORS.accent,
    fontSize: 16,
    fontFamily: FONTS.medium,
    textAlign: "center",
  },
  noEventsText: {
    color: COLORS.subtext,
    fontSize: 16,
    fontFamily: FONTS.medium,
    textAlign: "center",
  },
});
