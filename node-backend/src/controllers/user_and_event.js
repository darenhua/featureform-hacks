import { supabase } from "../../index.js";

// Create a user_event relationship in Supabase given two ids
export async function createUserEvent(req, res) {
  try {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ error: "userId and eventId are required" });
    }

    const { data, error } = await supabase
      .from("user_and_event")
      .insert([{ user: userId, event: eventId }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res
      .status(201)
      .json({ message: "User-Event relationship created", user_event: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Get all users associated with an event
export async function getUsersForEvent(req, res) {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ error: "eventId is required" });
    }

    // Get all user_and_event rows for the event
    const { data: userEvents, error } = await supabase
      .from("user_and_event")
      .select("user")
      .eq("event", eventId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const userIds = userEvents.map((ue) => ue.user);

    // Fetch user details
    const { data: users, error: usersError } = await supabase
      .from("user")
      .select("*")
      .in("id", userIds);

    if (usersError) {
      return res.status(500).json({ error: usersError.message });
    }

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
