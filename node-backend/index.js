import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

import routes from "./src/utils/routes.js";

const app = express();
app.use(express.json());

app.use(cors());
// app.options("*", cors());
routes(app);

// Connect to Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  console.log(`🎉 Server listening at http://localhost:${PORT} 🎉`);
});
