import {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEventById,
} from "../controllers/events.js";

import {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
} from "../controllers/users.js";

export default function routes(app) {
  app.get("/", (req, res) => res.status(200).send("200 OK"));

  // force change
  // Event routes
  app.post("/api/event", createEvent);
  app.get("/api/event", getAllEvents);
  app.get("/api/event/:id", getEventById);

  app.delete("/api/event/:id", deleteEventById);

  // User routes
  app.post("/api/user", createUser);
  app.get("/api/user/:id", getUserById);
  app.get("/api/users", getAllUsers);
  app.delete("/api/user/:id", deleteUserById);
  app.put("/api/user/:id", updateUserById);

  app.get("/", (req, res) => res.status(200).send("foo OK"));
}
