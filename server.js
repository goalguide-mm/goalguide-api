const fetch = require('node-fetch');
const AbortController = require('abort-controller'); // လိုအပ်ရင် install လုပ်ပါ

async function getFootballData() {
    const controller = new AbortController();
    // 8 စက္ကန့်အစား 20 စက္ကန့် (20000ms) အထိ စောင့်ခိုင်းမယ်
    const timeout = setTimeout(() => { controller.abort(); }, 20000); 

    try {
        const response = await fetch('https://api.football-data.org/v4/matches', {
            method: 'GET',
            headers: { 'X-Auth-Token': 'သင့်ရဲ့_API_TOKEN_ဒီမှာထည့်' },
            signal: controller.signal
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Request timeout ဖြစ်သွားလို့ ရပ်လိုက်ပါပြီ');
        } else {
            console.log('Error:', error.message);
        }
    } finally {
        clearTimeout(timeout);
    }
}
