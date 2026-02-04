const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Home route (ဒါမရှိလို့ Cannot GET / ဖြစ်နေတာ)
app.get("/", (req, res) => {
  res.send("GoalGuide API is running 🚀");
});

// ✅ Match route
app.get("/api/match/:id", async (req, res) => {
  const matchId = req.params.id;

  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?id=${matchId}`,
      {
        headers: {
          "x-apisports-key": process.env.FOOTBALL_API_KEY,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "API fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
