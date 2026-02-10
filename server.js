const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// သင့်ရဲ့ Key ကို သေချာထည့်ပေးထားပါတယ်
const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414'; 

app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        // အရေးကြီးဆုံးအချက်: မှန်ကန်တဲ့ Endpoint လင့်ကို ပြောင်းလဲထားပါတယ်
        const options = {
            method: 'GET',
            url: 'https://free-api-live-football-data.p.rapidapi.com/football-get-all-matches-by-date',
            params: {date: date},
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        
        // API ကလာတဲ့ data format အတိုင်း ပြန်စီထားပါတယ်
        const rawMatches = response.data.response || [];
        const matches = rawMatches.map(m => ({
            tournament: { name: m.league_name || "Match" },
            homeTeam: { name: m.home_name },
            awayTeam: { name: m.away_name },
            homeScore: { display: m.home_score !== null ? m.home_score : '-' },
            awayScore: { display: m.away_score !== null ? m.away_score : '-' },
            status: { type: m.status === 'Finished' ? 'finished' : 'timed' },
            startTimestamp: Math.floor(new Date(m.start_time).getTime() / 1000)
        }));

        res.json(matches);
    } catch (error) {
        console.error("Fetch Error:", error.message);
        res.json([]);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
