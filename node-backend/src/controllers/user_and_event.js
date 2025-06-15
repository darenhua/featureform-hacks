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

// Add a user to an event's users array
export async function addUserToEvent(req, res) {
  try {
    const { eventId, userIdfv } = req.params;

    if (!eventId || !userIdfv) {
      return res
        .status(400)
        .json({ error: "eventId and userIdfv are required" });
    }

    // Look for an existing user with this idfv
    const { data: user, error: userError } = await supabase
      .from("user")
      .select("id")
      .eq("idfv", userIdfv)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = user.id;

    // Fetch the event
    const { data: event, error: eventError } = await supabase
      .from("event")
      .select("users")
      .eq("id", eventId)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Merge userId into users array, avoiding duplicates
    const currentUsers = Array.isArray(event.users) ? event.users : [];
    if (currentUsers.includes(userId)) {
      return res
        .status(200)
        .json({ message: "User already added to event", users: currentUsers });
    }
    const updatedUsers = [...currentUsers, userId];

    // Update the event's users array
    const { data, error } = await supabase
      .from("event")
      .update({ users: updatedUsers })
      .eq("id", eventId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res
      .status(200)
      .json({ message: "User added to event", users: data.users });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
