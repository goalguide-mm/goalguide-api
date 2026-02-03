const express = require("express");
const app = express();

app.get("/api/fixtures", (req, res) => {
  res.json([
    {
      id: 1,
      home: "Liverpool",
      away: "Chelsea",
      date: "2026-02-06",
      time: "20:00",
    },
    {
      id: 2,
      home: "Man City",
      away: "Arsenal",
      date: "2026-02-06",
      time: "22:30",
    },
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
