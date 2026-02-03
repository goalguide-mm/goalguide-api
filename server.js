import fetch from "node-fetch";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("GoalGuide API is running ✅");
});

/* ======================
   LIVE MATCHES
====================== */
app.get("/api/live", async (req, res) => {
  try {
    const API_KEY = process.env.FOOTBALL_API_KEY;

    const url = `https://apiv2.allsportsapi.com/football/?met=Livescore&APIkey=${API_KEY}`;

    const r = await fetch(url);
    const json = await r.json();

    res.json(json.result || []);
  } catch (e) {
    console.error(e);
    res.status(500).json([]);
  }
});

/* ======================
   FIXTURES
====================== */
app.get("/api/fixtures", async (req, res) => {
  try {
    const API_KEY = process.env.FOOTBALL_API_KEY;

    const url = `https://apiv2.allsportsapi.com/football/?met=Fixtures&APIkey=${API_KEY}`;

    const r = await fetch(url);
    const json = await r.json();

    res.json(json.result || []);
  } catch (e) {
    console.error(e);
    res.status(500).json([]);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
