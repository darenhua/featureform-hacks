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
  processUser,
  onboardUser,
} from "../controllers/users.js";

<<<<<<< HEAD
import {
  getUsersForEvent,
  addUserToEvent, // <-- import the new function
} from "../controllers/user_and_event.js";
=======
// import {
//   createUserEvent,
//   getUsersForEvent,
// } from "../controllers/user_and_event.js";
>>>>>>> cf0b2f505d374db29a80e3d8cba578ce9a667510

export default function routes(app) {
  app.get("/", (req, res) => res.status(200).send("200 OK"));

  // Event routes
  app.post("/api/event", createEvent);
  app.get("/api/event", getAllEvents);
  app.get("/api/event/:id", getEventById);

  // User routes
  app.post("/api/user", createUser);
  app.get("/api/user/:id", getUserById);
  app.get("/api/users", getAllUsers);
  app.put("/api/user/:id", updateUserById);

  // User and Event routes
  app.get("/api/:eventId/users", getUsersForEvent);
  app.post("/api/:eventId/:userId", addUserToEvent); // <-- add this route

  app.get("/", (req, res) => res.status(200).send("foo OK"));
}
