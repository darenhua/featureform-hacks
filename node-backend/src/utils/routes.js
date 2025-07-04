import {
  createEvent,
  getAllEvents,
  getEventById,
  joinEvent,
  joinEventByIdfv,
} from "../controllers/events.js";

import {
  createUser,
  getAllUsers,
  getUserById,
  getUserByIdfv,
  updateUserById,
  processUser,
  onboardUser,
  findSimilarUsers,
} from "../controllers/users.js";

// import {
//   createUserEvent,
//   getUsersForEvent,
// } from "../controllers/user_and_event.js";

export default function routes(app) {
  app.get("/", (req, res) => res.status(200).send("200 OK"));

  // Event routes
  app.post("/api/event", createEvent);
  app.get("/api/event", getAllEvents);
  app.get("/api/event/:id", getEventById);
  app.post("/api/event/:id/join", joinEvent);

  // Alternative route for frontend IDFV-based joining
  app.post("/api/event/:eventId/:idfv", joinEventByIdfv);

  // Onboarding for linkedin , resume, and interests
  app.post("/api/user/onboard", onboardUser);
  app.post("/api/user/process", processUser);

  // User routes
  app.post("/api/user", createUser);
  app.get("/api/user/:id", getUserById);

  app.get("/api/user/idfv/:idfv", getUserByIdfv);

  app.get("/api/users", getAllUsers);
  app.put("/api/user/:id", updateUserById);

  // User and Event routes
  app.post("/api/user/find_similar_users", findSimilarUsers);

  // app.post("/api/user_event", createUserEvent);
  // app.get("/api/user_event/:eventId", getUsersForEvent);

  app.get("/", (req, res) => res.status(200).send("foo OK"));
}
