const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("GoalGuide API is running ✅");
});

app.get("/api/live", (req, res) => {
  res.json({ status: "live matches here" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
