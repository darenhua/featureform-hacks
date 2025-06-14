export default function routes(app) {
  app.get("/", (req, res) => res.status(200).send("200 OK"));
}
