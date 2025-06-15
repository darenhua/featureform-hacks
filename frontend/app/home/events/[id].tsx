import React from "react";
import { useLocalSearchParams } from "expo-router";
import { mockEvents } from "../mock";
import EventPage from "./components/EventPage";

export default function EventPageWrapper() {
  const { id } = useLocalSearchParams();
  console.log('Event ID received:', id); // Debug log
  console.log('Available events:', mockEvents.map(e => ({ id: e.id, name: e.name }))); // Debug log
  
  const event = mockEvents.find(e => e.id === id);
  console.log('Found event:', event); // Debug log

  return <EventPage event={event} />;
} 