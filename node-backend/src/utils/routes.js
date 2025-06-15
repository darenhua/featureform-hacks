import {
  createEvent,
  getAllEvents,
  getEventById,
  joinEvent,
} from "../controllers/events.js";

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/users.js";

import {
  createUserEvent,
  getUsersForEvent,
} from "../controllers/user_and_event.js";

export default function routes(app) {
  app.get("/", (req, res) => res.status(200).send("200 OK"));

  // force change
  // Event routes
  app.post("/api/event", createEvent);
  app.get("/api/event", getAllEvents);
  app.get("/api/event/:id", getEventById);
  app.post("/api/event/:id/join", joinEvent);


  // User routes
  app.post("/api/user", createUser);
  app.get("/api/user/:id", getUserById);
  app.get("/api/users", getAllUsers);
  app.put("/api/user/:id", updateUserById);

  app.post("/api/user_event", createUserEvent);
  app.get("/api/user_event/:eventId", getUsersForEvent);

  app.get("/", (req, res) => res.status(200).send("foo OK"));
}
