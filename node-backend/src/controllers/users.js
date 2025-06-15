import { supabase } from "../../index.js";

// Create a user
export async function createUser(req, res) {
  try {
    const { firstName, oneLiner } = req.body;
    if (!firstName) {
      return res.status(400).json({ error: "firstName is required" });
    }

    const { data, error } = await supabase
      .from("user")
      .insert([{ firstName, oneLiner: oneLiner || "" }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json({ message: "User created", user: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Get all users
export async function getAllUsers(req, res) {
  try {
    const { data, error } = await supabase.from("user").select("*");
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ users: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Get a user by id
export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ user: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Delete a user by id
export async function deleteUserById(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("user")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "User deleted", user: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

// Update a user by id
export async function updateUserById(req, res) {
  try {
    const { id } = req.params;
    const { firstName, oneLiner } = req.body;

    const updateFields = {};
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (oneLiner !== undefined) updateFields.oneLiner = oneLiner;

    const { data, error } = await supabase
      .from("user")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "User not found or not updated" });
    }
    return res.status(200).json({ message: "User updated", user: data });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
