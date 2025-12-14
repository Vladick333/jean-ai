// config.js - Настройки API
const CONFIG = {
    // === ВСТАВЬТЕ СЮДА ВАШИ КЛЮЧИ (СПИСОК) ===
    // ⚠️ ВАЖНО: Для GitHub мы оставляем здесь только заглушку.
    // Реальные ключи удалены, чтобы их не украли.
    RAW_KEYS: [
        "YOUR_API_KEY_HERE" 
    ],
    
    // Рабочие модели
    MODELS: [
        'gemini-1.5-flash',     // Самая быстрая (Бесплатная)
        'gemini-1.5-pro',       // Самая умная
        'gemini-1.0-pro'
    ],
    
    // Основные настройки (Выбрана Flash для скорости)
    DEFAULT_MODEL: 'gemini-1.5-flash',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7,

    // === ФУНКЦИЯ ПОЛУЧЕНИЯ ЧИСТОГО КЛЮЧА ===
    getKey: function() {
        if (!this.RAW_KEYS || this.RAW_KEYS.length === 0) return '';
        
        // 1. Берем случайный ключ
        const key = this.RAW_KEYS[Math.floor(Math.random() * this.RAW_KEYS.length)];
        
        // 2. УДАЛЯЕМ ПРОБЕЛЫ (Самое важное исправление ошибки ISO-8859-1)
        return key ? key.trim() : ''; 
    }
};

// === АВТОМАТИЧЕСКАЯ УСТАНОВКА ===
CONFIG.API_KEY = CONFIG.getKey();

// Экспорт
window.CONFIG = CONFIG;