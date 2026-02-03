import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

const API_KEY = process.env.FOOTBALL_API_KEY;

app.get("/", (req, res) => {
  res.send("GoalGuide API is running ✅");
});

// 🔴 LIVE MATCHES
app.get("/api/live", async (req, res) => {
  try {
    const r = await fetch(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );
    const data = await r.json();
    res.json(data.response || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 📅 FIXTURES TODAY
app.get("/api/fixtures", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const r = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${today}`,
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );
    const data = await r.json();
    res.json(data.response || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
