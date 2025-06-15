import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { getEventById, Event } from "../../api/events";
import EventPage from "./components/EventPage";

export default function EventPageWrapper() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id || typeof id !== 'string') {
        setError('Invalid event ID');
        setIsLoading(false);
        return;
      }

      try {
        const response = await getEventById(id);
        setEvent(response.event);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return <EventPage event={event} isLoading={isLoading} error={error} />;
} 