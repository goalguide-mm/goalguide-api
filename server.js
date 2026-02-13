const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';
const LIVESCORE_HOST = 'free-livescore-api.p.rapidapi.com';

app.get('/api/fixtures/date/:date', async (req, res) => {
    console.log("Request received for date:", req.params.date);
    try {
        const response = await axios.get(`https://${LIVESCORE_HOST}/soccer/fixtures-by-date`, {
            params: { date: req.params.date },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': LIVESCORE_HOST }
        });
        
        // API ဒေတာကို စစ်ဆေးခြင်း
        let data = response.data.data || response.data || [];
        
        // အကယ်၍ API က ဒေတာအလွတ် [] ပို့ပေးလာရင်တောင် စမ်းသပ်အသင်းကို ပြမယ်
        if (!Array.isArray(data) || data.length === 0) {
            data = [{
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
            }];
        }
        res.json(data);
    } catch (e) {
        console.log("API Error, sending test data...");
        // Error တက်ရင်လည်း Test Data ပဲ ပို့မယ်
        res.json([{ home_team: "Server Connect", away_team: "Success", status: "OK" }]);
    }
});

app.get('/api/highlights', (req, res) => res.json([]));
app.get('/api/standings/:league', (req, res) => res.json([]));

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => console.log('Server is running on port ' + PORT));
