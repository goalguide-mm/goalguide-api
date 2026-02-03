import fetch from "node-fetch";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("GoalGuide API is running ✅");
});

app.get("/api/live", (req, res) => {
  res.json([]); // live matches
});

app.get("/api/fixtures", (req, res) => {
  res.json([]); // fixtures
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
