const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414'; 

app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        
        // Fix 1: Endpoint URL ကို 'football-get-all-matches-by-date' ဖြစ်အောင် သေချာပြင်ထားပါတယ်
        const options = {
            method: 'GET',
            url: 'https://free-api-live-football-data.p.rapidapi.com/football-get-all-matches-by-date',
            params: { date: date },
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);

        // Fix 2: API ရဲ့ Response format က response.data.response.matches ထဲမှာ ရှိနေတာပါ
        // ဒါကြောင့် matches ကို ဆွဲထုတ်ပုံကို အမှန်ပြင်ပေးထားပါတယ်
        const rawMatches = response.data.response?.matches || []; 
        
        const matches = rawMatches.map(m => ({
            tournament: { name: m.league_name || "Football Match" },
            homeTeam: { name: m.home_name },
            awayTeam: { name: m.away_name },
            homeScore: { display: m.home_score !== null ? m.home_score : '-' },
            awayScore: { display: m.away_score !== null ? m.away_score : '-' },
            status: { type: m.status === 'Finished' ? 'finished' : 'timed' },
            // start_time မပါရင် လက်ရှိအချိန်ကို timestamp အဖြစ်ယူဖို့ ပြင်ထားပါတယ်
            startTimestamp: m.start_time ? Math.floor(new Date(m.start_time).getTime() / 1000) : Math.floor(Date.now() / 1000)
        }));

        res.json(matches);
    } catch (error) {
        // Log ထဲမှာ အမှားကို အတိအကျ မြင်ရအောင် console error ထည့်ထားပါတယ်
        console.error("Fetch Error:", error.response ? error.response.status : error.message);
        res.status(200).json([]); // Error ဖြစ်ရင်တောင် Frontend မှာ loading ပတ်မနေအောင် [] ပြန်ပေးမယ်
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
