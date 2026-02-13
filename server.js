const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';
const LIVESCORE_HOST = 'free-livescore-api.p.rapidapi.com';

// ၁။ Fixtures Route
app.get('/api/fixtures/date/:date', async (req, res) => {
    console.log(`[Request] Fixtures ခေါ်ဆိုမှု ရောက်လာပါပြီ - ရက်စွဲ: ${req.params.date}`);
    try {
        const response = await axios.get(`https://${LIVESCORE_HOST}/soccer/fixtures-by-date`, {
            params: { date: req.params.date },
            headers: { 'x-rapidapi-key': RAPID_API_KEY, 'x-rapidapi-host': LIVESCORE_HOST }
        });
        
        let data = response.data.data || response.data || [];
        
        // ဒေတာမရှိလျှင် Test Data ပြရန်
        if (!Array.isArray(data) || data.length === 0) {
            console.log("API မှ ဒေတာမလာသဖြင့် Test Data ပို့ပေးလိုက်သည်။");
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
        console.log("Error: ", e.message);
        res.json([]);
    }
});

// ၂။ Standings Route
app.get('/api/standings/:league', async (req, res) => {
    console.log("[Request] Standings ခေါ်ဆိုမှု ရောက်လာပါပြီ");
    res.json([]); 
});

// ၃။ Highlights Route
app.get('/api/highlights', async (req, res) => {
    console.log("[Request] Highlights ခေါ်ဆိုမှု ရောက်လာပါပြီ");
    res.json([]);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('------------------------------------');
    console.log('Server is running on port ' + PORT);
    console.log('Window ကို ပိတ်မချပါနဲ့။');
    console.log('------------------------------------');
});
