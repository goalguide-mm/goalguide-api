const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running");
});

// ✅ LIVE
app.get("/api/live", (req, res) => {
  res.json([
    {
      home: "Liverpool",
      away: "Man United",
      minute: 67,
      score: "1 - 0"
    }
  ]);
});

// ✅ FIXTURES
app.get("/api/fixtures", (req, res) => {
  res.json([
    {
      home: "Arsenal",
      away: "Chelsea"
    }
  ]);
});

// ✅ RESULTS
app.get("/api/results", (req, res) => {
  res.json([
    {
      home: "Man City",
      away: "Spurs",
      score: "3 - 1"
    }
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
