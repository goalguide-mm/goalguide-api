const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// သင်ပေးထားတဲ့ RapidAPI Key အသစ်
const RAPID_API_KEY = "8036adbe09msh678d6f6056a98afp13bcddjsn155f505d7a49";
const RAPID_API_HOST = "sportapi7.p.rapidapi.com";

app.get("/", (req, res) => {
  res.send("GoalGuide API with RapidAPI is running 🚀");
});

// ၁။ Today Matches (ယနေ့ပွဲစဉ်များ)
app.get('/api/today', async (req, res) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://sportapi7.p.rapidapi.com/api/v1/sport/football/scheduled-events/2026-02-07', // ယနေ့ရက်စွဲ
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': RAPID_API_HOST
            }
        };
        const response = await axios.request(options);
        res.json(response.data.events || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ၂။ Fixtures by Date (ရက်စွဲအလိုက်)
app.get("/api/fixtures/date/:date", async (req, res) => {
  const date = req.params.date; 
  try {
    const options = {
        method: 'GET',
        url: `https://sportapi7.p.rapidapi.com/api/v1/sport/football/scheduled-events/${date}`,
        headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': RAPID_API_HOST
        }
    };
    const response = await axios.request(options);
    res.json(response.data.events || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ၃။ Match Detail (ပွဲအသေးစိတ်)
app.get("/api/fixtures/:id", async (req, res) => {
  const eventId = req.params.id;
  try {
    const options = {
        method: 'GET',
        url: `https://sportapi7.p.rapidapi.com/api/v1/event/${eventId}`,
        headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': RAPID_API_HOST
        }
    };
    const response = await axios.request(options);
    res.json(response.data.event || {});
  } catch (error) {
    res.status(500).json({ error: "Detail fetch failed" });
  }
});

// ၄။ Highlights API (ScoreBat က ဒေတာမပေးရင် 403 တက်တတ်လို့ ပြန်စစ်ထားပါတယ်)
app.get('/api/highlights', async (req, res) => {
  try {
    const response = await axios.get('https://www.scorebat.com/video-api/v3/feed/?token=MTc5MDU0XzE3Mzg5MTM1ODZfNGU5YjA3ZGE1YjU1MmFkYjQ5ZTkzZjc0N2U2YmFmYjBkYmNmMDdhYg==');
    res.json(response.data.response || []); 
  } catch (error) {
    res.status(500).json({ error: "Highlight error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
