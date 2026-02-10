const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());

const RAPID_API_KEY = '1891f92204msh75d72c439e09157p13bd03jsn35ea6745f414';

app.get('/api/fixtures/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        // ရက်စွဲကို API တောင်းတဲ့ပုံစံ (YYYYMMDD) ပြောင်းတာပါ
        const apiDate = date.replace(/-/g, ''); 

        const options = {
            method: 'GET',
            url: 'https://free-livescore-api.p.rapidapi.com/livescore/get-fixtures',
            params: { date: apiDate },
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': 'free-livescore-api.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        
        // API ကလာတဲ့ ဒေတာဖွဲ့စည်းပုံအရ ပြန်စီတာပါ
        if (response.data && response.data.response) {
            return res.json(response.data.response);
        }
        res.json([]);
    } catch (error) {
        res.status(500).json([]);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log("Backend Ready"));
