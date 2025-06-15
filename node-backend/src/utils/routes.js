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

  // Event routes
  app.post("/event", createEvent);
  app.get("/event/:id", getEventById);
  app.get("/events", getAllEvents);
  app.delete("/event/:id", deleteEventById);

  // User routes
  app.post("/user", createUser);
  app.get("/user/:id", getUserById);
  app.get("/users", getAllUsers);
  app.delete("/user/:id", deleteUserById);
  app.put("/user/:id", updateUserById);
}
