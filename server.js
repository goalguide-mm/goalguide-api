const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// CORS Error အားလုံးကို ရှင်းထုတ်ရန်
app.use(cors());

// သင့်ရဲ့ RapidAPI Key ကို ပုံထဲကအတိုင်း ထည့်ပေးထားပါတယ်
const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414'; 
const RAPID_HOST = 'free-api-live-football-data.p.rapidapi.com';

app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        console.log(`Fetching matches for date: ${date}`);

        const response = await axios.get(`https://${RAPID_HOST}/football-get-all-matches-by-date`, {
            params: { date: date },
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': RAPID_HOST
            }
        });

        // API တုံ့ပြန်မှုကို Frontend နားလည်သော ပုံစံသို့ ပြောင်းလဲခြင်း
        const rawMatches = response.data.response || [];
        const matches = rawMatches.map(m => ({
            tournament: { name: m.league_name || "International" },
            homeTeam: { name: m.home_name },
            awayTeam: { name: m.away_name },
            homeScore: { display: m.home_score !== null ? m.home_score : '-' },
            awayScore: { display: m.away_score !== null ? m.away_score : '-' },
            status: { type: m.status === 'Finished' ? 'finished' : 'timed' },
            startTimestamp: Math.floor(new Date(m.start_time).getTime() / 1000)
        }));

        res.json(matches);
    } catch (error) {
        console.error("API Fetch Error:", error.message);
        res.json([]);
    }
});

// Standings Route (အမှတ်ပေးဇယားအတွက်)
app.get('/api/standings/:league', (req, res) => res.json([]));
app.get('/api/highlights', (req, res) => res.json([]));

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running with RapidAPI on port ${PORT}`);
});
