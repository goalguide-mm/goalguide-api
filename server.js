const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';
const LIVESCORE_HOST = 'free-livescore-api.p.rapidapi.com';

app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const response = await axios.get(`https://${LIVESCORE_HOST}/soccer/fixtures-by-date`, {
            params: { date: req.params.date },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': LIVESCORE_HOST }
        });
        
        let data = response.data.data || response.data || [];
        
        // --- အရေးကြီးသည်: ဒေတာ မလာရင် စမ်းသပ်ဖို့ Dummy Data ထည့်ခြင်း ---
        if (!Array.isArray(data) || data.length === 0) {
            data = [
                {
                    home_team: "စမ်းသပ်အသင်း (A)",
                    home_logo: "https://via.placeholder.com/50",
                    away_team: "စမ်းသပ်အသင်း (B)",
                    away_logo: "https://via.placeholder.com/50",
                    home_score: 0,
                    away_score: 0,
                    status: "NS",
                    time: "20:00",
                    league_name: "Test League",
                    league_logo: "https://via.placeholder.com/20"
                }
            ];
        }
        res.json(data);
    } catch (e) {
        res.json([]);
    }
});

// အခြား Route များ (Highlights, Standings) ကိုလည်း အရင်ကအတိုင်း ထားပါ...
app.get('/api/highlights', async (req, res) => { res.json([]); });
app.get('/api/standings/:league', async (req, res) => { res.json([]); });

const PORT = 3000;
app.listen(PORT, () => console.log('Server is running on port ' + PORT));
