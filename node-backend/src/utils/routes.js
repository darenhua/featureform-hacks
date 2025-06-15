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

import {
  getUsersForEvent,
  addUserToEvent, // <-- import the new function
} from "../controllers/user_and_event.js";

export default function routes(app) {
  app.get("/", (req, res) => res.status(200).send("200 OK"));

  // Event routes
  app.post("/api/event", createEvent);
  app.get("/api/event", getAllEvents);
  app.get("/api/event/:id", getEventById);
<<<<<<< HEAD
  app.post("/api/event/:id/join", joinEvent);
  
  // Onboarding for linkedin , resume, and interests
  app.post("/api/user/onboard", onboardUser);
  app.post("/api/user/process", processUser);

=======
>>>>>>> 73782cd2b2f1dc95501050f09f8f820975291585

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
