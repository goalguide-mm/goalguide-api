import fetch from "node-fetch";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const API_KEY = process.env.FOOTBALL_API_KEY;
const API_URL = "https://v3.football.api-sports.io";

app.get("/", (req, res) => {
  res.send("GoalGuide API is running ✅");
});

app.get("/api/live", async (req, res) => {
  try {
    const r = await fetch(`${API_URL}/fixtures?live=all`, {
      headers: {
        "x-apisports-key": API_KEY
      }
    });
    const data = await r.json();
    res.json(data.response || []);
  } catch (e) {
    res.status(500).json({ error: "Live fetch failed" });
  }
});

app.get("/api/fixtures", async (req, res) => {
  try {
    const r = await fetch(`${API_URL}/fixtures?next=20`, {
      headers: {
        "x-apisports-key": API_KEY
      }
    });
    const data = await r.json();
    res.json(data.response || []);
  } catch (e) {
    res.status(500).json({ error: "Fixtures fetch failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
