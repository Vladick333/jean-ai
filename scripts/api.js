// api.js
const API = {
    apiKey: '', // Твой текущий ключ
    
    async sendMessage(message) {
        console.log(`📡 [SYSTEM] Отправка данных...`);
        
        // !!! МЫ ПОМЕНЯЛИ МОДЕЛЬ НА 1.5 FLASH !!!
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Ошибка Google: ${errorData.error?.message || response.status}`);
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    },

    async testConnection() {
        return true; 
    }
};

// Делаем доступным глобально
window.API = API;