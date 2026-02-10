const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// သင်နောက်ဆုံးရထားတဲ့ API Token အသစ်ကို ဒီမှာထည့်ထားပါတယ်
const API_KEY = '4c9add6d3582492aacdec6bd646ff229'; 

app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        console.log(`Fetching matches for date: ${date}`);

        // football-data.org API ဆီကနေ data လှမ်းယူခြင်း
        const response = await axios.get(`https://api.football-data.org/v4/matches?dateFrom=${date}&dateTo=${date}`, {
            headers: { 'X-Auth-Token': API_KEY },
            timeout: 60000 // API ဘက်က နှေးနေရင် 1 မိနစ်အထိ စောင့်ခိုင်းထားပါတယ်
        });

        // Data ရရင် Frontend ဆီ ပြန်ပို့ပေးပါတယ်
        res.json(response.data.matches || []);
    } catch (error) {
        // Error ဖြစ်ရင် Logs ထဲမှာ အကြောင်းရင်းကို ပြပေးမှာပါ
        console.error("API Error Detail:", error.response ? error.response.data : error.message);
        res.status(500).json({ 
            error: "API connection failed", 
            details: error.message 
        });
    }
});

// Render ရဲ့ Port setting အတွက် ဖြစ်ပါတယ်
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
