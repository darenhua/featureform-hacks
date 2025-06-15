import { supabase } from "../../index.js";

// Create an event in Supabase
export async function createEvent(req, res) {
  try {
    const { name, location, date, time, description, image_url } = req.body;

    if (!name || !date || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("event")
      .insert([
        {
          name,
          location,
          date,
          time,
          description: description || "",
          image_url: image_url || "",
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json({ message: "Event created", event: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Retrieve all events from Supabase
export async function getAllEvents(req, res) {
  try {
    const { data, error } = await supabase.from("event").select("*");
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ events: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Get a single event by id from Supabase
export async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("event")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ error: "Event not found" });
    }
    return res.status(200).json({ event: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}


// Join an event by adding user IDFV to users array
export async function joinEvent(req, res) {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // First, get the current event
    const { data: eventData, error: fetchError } = await supabase
      .from("event")
      .select("users")
      .eq("id", id)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if user is already in the array
    const currentUsers = eventData.users || [];
    if (currentUsers.includes(user_id)) {
      return res.status(200).json({ message: "User already joined", event: eventData });
    }

    // Add user to the array
    const updatedUsers = [...currentUsers, user_id];

    // Update the event with the new users array
    const { data, error } = await supabase
      .from("event")
      .update({ users: updatedUsers })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: "User joined event", event: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Delete an event by id from Supabase
export async function deleteEventById(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("event")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ error: "Event not found" });
    }
    return res.status(200).json({ message: "Event deleted", event: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
