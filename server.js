const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// CORS ကို အားလုံးအတွက် ခွင့်ပြုပေးလိုက်ပါ (Website ကနေ လှမ်းခေါ်လို့ရအောင်)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// သင်နောက်ဆုံးရထားတဲ့ API Token အသစ်
const API_KEY = '4c9add6d3582492aacdec6bd646ff229'; 

app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        console.log(`Fetching matches for date: ${date}`);

        const response = await axios.get(`https://api.football-data.org/v4/matches?dateFrom=${date}&dateTo=${date}`, {
            headers: { 'X-Auth-Token': API_KEY },
            timeout: 60000 // ၁ မိနစ် စောင့်ပေးရန်
        });

        // Data ပြန်ပို့ပေးရန်
        res.status(200).json(response.data.matches || []);
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json({ error: "Server connection failed" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
