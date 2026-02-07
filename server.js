const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());

const RAPID_API_KEY = "2ddaa309ebmsh47cf43acc2412c9p103ba3jsn669fe3c14665";
const RAPID_API_HOST = "sportapi7.p.rapidapi.com";

// Standings
app.get("/api/standings", async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://sportapi7.p.rapidapi.com/api/v1/tournament/8/season/61627/standings/total',
      headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_API_HOST }
    };
    const response = await axios.request(options);
    res.json(response.data.standings || []);
  } catch (error) { res.json([]); }
});

// Fixtures (ဒီအပိုင်းကို image_1b35e4.png အရ ပြင်ထားပါတယ်)
app.get("/api/fixtures/date/:date", async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: `https://sportapi7.p.rapidapi.com/api/v1/sport/football/scheduled-events/${req.params.date}`,
      headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_API_HOST }
    };
    const response = await axios.request(options);
    
    // image_1b35e4.png အရ ဒေတာက events ထဲမှာ ရှိနေတာမို့ သေချာထုတ်ပေးထားပါတယ်
    const allData = response.data;
    const matchEvents = allData.events || allData.data || (Array.isArray(allData) ? allData : []);
    
    res.json(matchEvents);
  } catch (e) { 
    console.error("Fetch Error:", e.message);
    res.json([]); 
  }
});

// Highlights
app.get('/api/highlights', async (req, res) => {
  try {
    const response = await axios.get('https://www.scorebat.com/video-api/v3/');
    res.json(response.data.response.slice(0, 15));
  } catch (error) { res.json([]); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server is running perfectly..."));
