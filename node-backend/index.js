import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import routes from "./src/utils/routes.js";

const app = express();
app.use(express.json());

app.use(cors());
// app.options("*", cors());
routes(app);

const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  console.log(`🎉 Server listening at http://localhost:${PORT} 🎉`);
});
