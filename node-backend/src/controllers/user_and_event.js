import { supabase } from "../../index.js";

// Get all users associated with an event (from event's users array)
export async function getUsersForEvent(req, res) {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ error: "eventId is required" });
    }

    // Fetch the event to get the users array
    const { data: event, error: eventError } = await supabase
      .from("event")
      .select("users")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const userIds = Array.isArray(event.users) ? event.users : [];
    if (userIds.length === 0) {
      return res.status(200).json({ users: [] });
    }

    // Fetch user details for all userIds
    const { data: users, error: usersError } = await supabase
      .from("user")
      .select("*")
      .in("idfv", userIds);

    if (usersError) {
      return res.status(500).json({ error: usersError.message });
    }

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
