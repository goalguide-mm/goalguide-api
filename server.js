const express = require('express');
const axios = require('axios'); // သင့်ဆီမှာ ရှိပြီးသားမို့ ဒါပဲ သုံးပါမယ်
const cors = require('cors');

const app = express();
app.use(cors());

// သင် အခုလေးတင်ပေးထားတဲ့ API Key အသစ်
const API_KEY = '4c9add6d3582492aacdec6bd646ff229'; 

app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        console.log(`Fetching matches for: ${date}`);

        const response = await axios.get(`https://api.football-data.org/v4/matches?dateFrom=${date}&dateTo=${date}`, {
            headers: { 'X-Auth-Token': API_KEY },
            timeout: 60000 // Timeout ကို ၁ မိနစ်အထိ ထားထားပါတယ်
        });

        // ပွဲစဉ်တွေ ရှိရင် ပို့မယ်၊ မရှိရင် အလွတ် [] ပို့မယ်
        res.status(200).json(response.data.matches || []);
    } catch (error) {
        console.error("API Error Detail:", error.message);
        res.status(500).json({ error: "API connection failed" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
