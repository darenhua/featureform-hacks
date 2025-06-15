import {
  createEvent,
  getAllEvents,
  getEventById,
  deleteEventById,
} from "../controllers/events.js";

export default function routes(app) {
  app.get("/", (req, res) => res.status(200).send("200 OK"));

  app.post("/event", createEvent);
  app.get("/event/:id", getEventById);
  app.get("/events", getAllEvents);
  app.delete("/event/:id", deleteEventById);

  app.post("/person", (req, res) => res.status(200).send("200 OK"));
  app.get("/person/:id", (req, res) => res.status(200).send("200 OK"));
}
