const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// test
app.get("/", (req, res) => {
  res.send("Goal Guide API running ✅");
});

// fixtures (today + live + tomorrow)
app.get("/api/fixtures", (req, res) => {
  res.json({
    live: [
      {
        id: 1,
        home: "Liverpool",
        away: "Man United",
        minute: 67,
        status: "LIVE"
      }
    ],
    today: [
      {
        id: 2,
        home: "Arsenal",
        away: "Chelsea",
        time: "22:30"
      }
    ],
    tomorrow: [
      {
        id: 3,
        home: "Real Madrid",
        away: "Barcelona",
        time: "01:00"
      }
    ]
  });
});

// results (yesterday)
app.get("/api/results", (req, res) => {
  res.json([
    {
      id: 10,
      home: "Bayern",
      away: "Dortmund",
      score: "3 - 1",
      status: "FT"
    }
  ]);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server running 👉 http://localhost:" + PORT);
});
