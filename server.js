// server.js (Backend)
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());

const RAPID_API_KEY = "8036adbe09msh678d6f6056a98afp13bcddjsn155f505d7a49";
const RAPID_API_HOST = "sportapi7.p.rapidapi.com";

// Standings Endpoint (404 မဖြစ်အောင် ထည့်ပေးထားသည်)
app.get("/api/standings", async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://sportapi7.p.rapidapi.com/api/v1/tournament/8/season/61627/standings/total', // EPL Standard
      headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_API_HOST }
    };
    const response = await axios.request(options);
    res.json(response.data.standings || []);
  } catch (error) {
    res.status(500).json({ error: "Standings fetch failed" });
  }
});

// Fixtures Endpoint
app.get("/api/fixtures/date/:date", async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: `https://sportapi7.p.rapidapi.com/api/v1/sport/football/scheduled-events/${req.params.date}`,
      headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_API_HOST }
    };
    const response = await axios.request(options);
    res.json(response.data.events || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Match Details
app.get("/api/fixtures/:id", async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: `https://sportapi7.p.rapidapi.com/api/v1/event/${req.params.id}`,
      headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_API_HOST }
    };
    const response = await axios.request(options);
    res.json(response.data.event || {});
  } catch (error) {
    res.status(404).json({ error: "Not found" });
  }
});

app.listen(3000, () => console.log("Server running..."));
