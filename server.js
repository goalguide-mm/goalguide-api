const express = require("express");
const cors = require("cors");   // ✅ ဒီလိုထည့်
const app = express();

app.use(cors());                // ✅ ဒီလိုထည့်

// test route
app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/fixtures", (req, res) => {
  res.json([
    {
      id: 101,
      home: "Liverpool",
      away: "Man United",
      status: "LIVE",
      minute: 67
    }
  ]);
});

// results API
app.get("/api/results", (req, res) => {
  res.json([
    {
      id: 201,
      home: "Arsenal",
      away: "Chelsea",
      score: "2 - 1",
      status: "FT"
    }
  ]);
});

// Render port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
