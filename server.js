const express = require("express");
<<<<<<< HEAD
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
// Fixtures - နေ့စွဲပုံစံကို အလိုအလျောက် ပြောင်းပေးအောင် ပြင်ဆင်ထားသည်
app.get("/api/fixtures/date/:date", async (req, res) => {
  try {
    let requestedDate = req.params.date;

    // အကယ်၍ App က 08/02/2026 (DD/MM/YYYY) နဲ့ ပို့လာရင် 2026-02-08 ပြောင်းပေးခြင်း
    if (requestedDate.includes("-") && requestedDate.split("-")[0].length === 2) {
        // 08-02-2026 format ဖြစ်နေလျှင်
        const parts = requestedDate.split("-");
        requestedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    } else if (requestedDate.includes("/")) {
        // 08/02/2026 format ဖြစ်နေလျှင်
        const parts = requestedDate.split("/");
        requestedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    const options = {
      method: 'GET',
      url: `https://sportapi7.p.rapidapi.com/api/v1/sport/football/scheduled-events/${requestedDate}`,
      headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': RAPID_API_HOST }
    };
    
    const response = await axios.request(options);
    // ဒေတာရှိလျှင် ပြပေးမည်၊ မရှိလျှင် [] ပြပေးမည်
    res.json(response.data.events || []);
    
  } catch (e) { 
    console.error("API Error:", e.message);
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
=======
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());



const API_KEY = "8e825b0645b7463c1e08ceafc2e16b487b652e8901744a65dd04026207afa2d5";

/* ===== TEST ===== */
app.get("/test", (req, res) => {
  res.json({ status: "ok", message: "Test route working ✅" });
});

/* ===== LIVE MATCHES ===== */
app.get("/api/live", async (req, res) => {
  try {
    const url = `https://apiv2.allsportsapi.com/football/?met=Livescore&APIkey=${API_KEY}`;
    const r = await fetch(url);
    const json = await r.json();
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: "Live fetch failed", details: err.message });
  }
});

/* ===== FIXTURES ===== */
app.get("/api/fixtures", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const url = `https://apiv2.allsportsapi.com/football/?met=Fixtures&from=${today}&to=${today}&APIkey=${API_KEY}`;
    const r = await fetch(url);
    const json = await r.json();
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: "Fixtures fetch failed", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

>>>>>>> 00ed70d (upload my api code)
