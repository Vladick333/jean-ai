// Основной модуль системы
const System = {
    version: '2.0.1',
    sessionId: null,
    settings: {},
    tools: {},
    currentTool: 'NEURAL_CORE',
    messages: [],

    init: function() {
        console.log('🚀 Инициализация GRID OS v' + this.version);
        
        // Генерация ID сессии
        this.sessionId = 'NXM-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        document.getElementById('session-id').textContent = this.sessionId;
        
        // Загрузка настроек из localStorage
        this.loadSettings();
        
        // Инициализация событий
        this.initEvents();
        
        // Запуск системного мониторинга
        this.startMonitoring();
        
        console.log('✅ Система инициализирована');
        this.showNotification('Система загружена', 'success');
    },

    loadSettings: function() {
        const defaultSettings = {
            apiKey: '', // ОСТАВЛЯЕМ ПУСТЫМ!
            model: 'gemini-1.5-flash', // <--- ПОСТАВИЛИ FLASH
            temperature: 0.7,
            creativity: 0.5,
            responseLength: 'medium',
            soundEffects: true,
            animations: true,
            theme: 'cyberpunk'
        };
        
        try {
            const saved = localStorage.getItem('gridOS_settings');
            this.settings = saved ? JSON.parse(saved) : defaultSettings;
        } catch (e) {
            this.settings = defaultSettings;
        }
        
        // Применяем настройки
        this.applySettings();
    },

    saveSettings: function() {
        localStorage.setItem('gridOS_settings', JSON.stringify(this.settings));
    },

    applySettings: function() {
        // Применение настроек к интерфейсу
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        document.getElementById('temp-value').textContent = this.settings.temperature;
        document.getElementById('creativity-value').textContent = this.settings.creativity;
        document.getElementById('model-select').value = this.settings.model;
        
        // Обновляем слайдеры
        const tempSlider = document.getElementById('temp-slider');
        const creativitySlider = document.getElementById('creativity-slider');
        const lengthSelect = document.getElementById('length-select');
        
        if (tempSlider) tempSlider.value = this.settings.temperature;
        if (creativitySlider) creativitySlider.value = this.settings.creativity;
        if (lengthSelect) lengthSelect.value = this.settings.responseLength;
    },

    initEvents: function() {
        // Кнопка отправки сообщения
        const sendBtn = document.getElementById('send-message');
        const messageInput = document.getElementById('message-input');
        
        sendBtn.addEventListener('click', () => Chat.sendMessage());
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                Chat.sendMessage();
            }
        });
        
        // Голосовой ввод
        const voiceBtn = document.getElementById('start-voice');
        voiceBtn.addEventListener('click', () => Chat.startVoiceInput());
        
        // Прикрепление файлов
        const attachBtn = document.getElementById('attach-file');
        attachBtn.addEventListener('click', () => Chat.attachFile());
        
        // Очистка чата
        const clearBtn = document.getElementById('clear-chat');
        clearBtn.addEventListener('click', () => {
            if (confirm('Очистить всю историю чата?')) {
                Chat.clear();
            }
        });
        
        // Экспорт чата
        const exportBtn = document.getElementById('export-chat');
        exportBtn.addEventListener('click', () => Chat.export());
        
        // Настройки API
        const apiBtn = document.getElementById('settings-btn');
        const apiModal = document.getElementById('api-modal');
        const closeApi = document.getElementById('close-api');
        const saveApi = document.getElementById('save-api');
        const testApi = document.getElementById('test-api');
        
        apiBtn.addEventListener('click', () => Modals.show('api-modal'));
        closeApi.addEventListener('click', () => Modals.hide('api-modal'));
        
        saveApi.addEventListener('click', () => {
            const apiKey = document.getElementById('api-key').value;
            const model = document.getElementById('model-select').value;
            
            if (apiKey) {
                this.settings.apiKey = apiKey;
                this.settings.model = model;
                this.saveSettings();
                this.showNotification('Настройки сохранены', 'success');
            }
        });
        
        testApi.addEventListener('click', () => API.testConnection());
        
        // Настройки температуры
        const tempSlider = document.getElementById('temp-slider');
        const creativitySlider = document.getElementById('creativity-slider');
        const lengthSelect = document.getElementById('length-select');
        
        tempSlider.addEventListener('input', (e) => {
            document.getElementById('temp-value').textContent = e.target.value;
            this.settings.temperature = parseFloat(e.target.value);
            this.saveSettings();
        });
        
        creativitySlider.addEventListener('input', (e) => {
            document.getElementById('creativity-value').textContent = e.target.value;
            this.settings.creativity = parseFloat(e.target.value);
            this.saveSettings();
        });
        
        lengthSelect.addEventListener('change', (e) => {
            this.settings.responseLength = e.target.value;
            this.saveSettings();
        });
        
        // Полный экран
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(console.log);
            } else {
                document.exitFullscreen();
            }
        });
        
        // Аварийный стоп
        const emergencyBtn = document.getElementById('emergency-btn');
        emergencyBtn.addEventListener('click', () => {
            if (confirm('⚠️ АКТИВИРОВАТЬ АВАРИЙНЫЙ СТОП?\nВсе процессы будут остановлены.')) {
                this.emergencyStop();
            }
        });
        
        // Быстрые команды
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const command = e.target.dataset.command;
                Chat.processQuickCommand(command);
            });
        });
        
        // Переключение инструментов
        document.addEventListener('toolSelected', (e) => {
            this.currentTool = e.detail.tool;
            this.updateInterface();
        });
    },

    startMonitoring: function() {
        // Мониторинг использования ЦП
        setInterval(() => {
            const usage = Math.floor(Math.random() * 30) + 10; // Имитация
            document.getElementById('cpu-value').textContent = usage + '%';
            document.getElementById('cpu-fill').style.width = usage + '%';
            
            // Обновление других метрик
            document.getElementById('ram-usage').textContent = Math.floor(Math.random() * 40) + 30 + '%';
            document.getElementById('ssd-usage').textContent = Math.floor(Math.random() * 30) + 40 + '%';
            document.getElementById('cpu-temp').textContent = Math.floor(Math.random() * 20) + 40 + '°C';
        }, 5000);
    },

    updateInterface: function() {
        // Обновление интерфейса при смене инструмента
        const tool = this.tools[this.currentTool];
        if (tool) {
            document.getElementById('current-tool').textContent = tool.name;
            document.getElementById('prompt-tool').textContent = tool.name;
            document.title = `GRID OS: ${tool.name} | v${this.version}`;
        }
        
        // Обновление счетчика сообщений
        document.getElementById('message-count').textContent = this.messages.length;
    },

    emergencyStop: function() {
        this.showNotification('🛑 АВАРИЙНЫЙ СТОП АКТИВИРОВАН', 'error');
        
        // Остановка всех процессов
        Chat.clear();
        Effects.stopAll();
        
        // Блокировка интерфейса
        document.querySelectorAll('button, textarea').forEach(el => {
            el.disabled = true;
        });
        
        // Красный экран
        document.body.style.backgroundColor = '#330000';
        document.body.style.animation = 'pulseRed 1s infinite';
        
        setTimeout(() => {
            location.reload();
        }, 3000);
    },

    showNotification: function(message, type = 'info', duration = 5000) {
        const notifications = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || 'ℹ️'}</div>
            <div class="notification-content">
                <div class="notification-title">${type.toUpperCase()}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        notifications.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Закрытие по кнопке
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Автоматическое закрытие
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, duration);
        }
    }
};

// Модуль чата
const Chat = {
    init: function() {
        this.loadHistory();
        this.initTypingAnimation();
    },

    sendMessage: function() {
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Добавление сообщения пользователя
        this.addMessage(message, 'user');
        
        // Очистка поля ввода
        input.value = '';
        input.style.height = 'auto';
        
        // Отображение индикатора загрузки
        this.showTypingIndicator();
        
        // Отправка запроса к AI
        setTimeout(() => {
            this.processAIResponse(message);
        }, 500);
    },

    addMessage: function(content, role, timestamp = new Date()) {
        const message = {
            id: Date.now(),
            role: role,
            content: content,
            timestamp: timestamp,
            tool: System.currentTool
        };
        
        System.messages.push(message);
        this.renderMessage(message);
        this.saveHistory();
        System.updateInterface();
    },

    renderMessage: function(message) {
        const container = document.getElementById('chat-messages');
        const messageEl = document.createElement('div');
        
        const time = message.timestamp.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const tool = System.tools[message.tool] || { name: 'NEURAL CORE', icon: '🧠' };
        
        messageEl.className = `message-bubble ${message.role}`;
        messageEl.innerHTML = `
            <div class="message-header">
                <span class="message-avatar">${message.role === 'user' ? '👤' : tool.icon}</span>
                <span class="message-author">${message.role === 'user' ? 'ПОЛЬЗОВАТЕЛЬ' : tool.name}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${this.formatContent(message.content)}</div>
        `;
        
        container.appendChild(messageEl);
        
        // Прокрутка вниз
        container.scrollTop = container.scrollHeight;
        
        // Анимация
        messageEl.style.animation = 'fadeIn 0.3s ease';
        
        // Звуковое уведомление
        if (System.settings.soundEffects && message.role === 'assistant') {
            Audio.play('notification');
        }
    },

    formatContent: function(content) {
        // Форматирование текста: код, ссылки, списки
        let formatted = content
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/\n/g, '<br>');
        
        return formatted;
    },

    showTypingIndicator: function() {
        const container = document.getElementById('chat-messages');
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="message-bubble assistant">
                <div class="message-header">
                    <span class="message-avatar">🤖</span>
                    <span class="message-author">${System.tools[System.currentTool]?.name || 'NEURAL CORE'}</span>
                    <span class="message-time">...</span>
                </div>
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(indicator);
        container.scrollTop = container.scrollHeight;
    },

    hideTypingIndicator: function() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    },

    processAIResponse: async function(userMessage) {
        try {
            const response = await API.sendMessage(userMessage, System.currentTool);
            this.hideTypingIndicator();
            this.addMessage(response, 'assistant');
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage(`❌ Ошибка: ${error.message}`, 'assistant');
            System.showNotification('Ошибка соединения с AI', 'error');
        }
    },

    startVoiceInput: function() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            System.showNotification('Голосовой ввод не поддерживается вашим браузером', 'warning');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'ru-RU';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = () => {
            System.showNotification('🎤 Слушаю...', 'info');
            document.getElementById('start-voice').classList.add('recording');
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('message-input').value = transcript;
            System.showNotification('Текст распознан', 'success');
        };
        
        recognition.onerror = (event) => {
            System.showNotification('Ошибка распознавания: ' + event.error, 'error');
        };
        
        recognition.onend = () => {
            document.getElementById('start-voice').classList.remove('recording');
        };
        
        recognition.start();
    },

    attachFile: function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,.pdf,.txt,.doc,.docx';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // Проверка размера файла (макс 5MB)
            if (file.size > 5 * 1024 * 1024) {
                System.showNotification('Файл слишком большой (макс 5MB)', 'error');
                return;
            }
            
            // Отображение превью
            const preview = document.getElementById('file-preview');
            const previewItem = document.createElement('div');
            previewItem.className = 'file-preview-item';
            
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="${file.name}" style="max-width: 100px; max-height: 100px;">
                        <div class="file-info">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${(file.size / 1024).toFixed(1)} KB</div>
                        </div>
                        <button class="remove-file" data-filename="${file.name}">&times;</button>
                    `;
                };
                reader.readAsDataURL(file);
            } else {
                previewItem.innerHTML = `
                    <div class="file-icon">📄</div>
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <button class="remove-file" data-filename="${file.name}">&times;</button>
                `;
            }
            
            preview.appendChild(previewItem);
            
            // Добавление обработчика удаления
            previewItem.querySelector('.remove-file').addEventListener('click', function() {
                previewItem.remove();
            });
            
            System.showNotification(`Файл "${file.name}" прикреплен`, 'success');
        };
        
        input.click();
    },

    processQuickCommand: function(command) {
        const commands = {
            '/help': 'Доступные команды:\n/help - эта справка\n/code - режим программирования\n/image - работа с изображениями\n/analyze - глубокий анализ\n/clear - очистка чата\n/settings - настройки',
            '/code': 'Переключение в режим программирования...',
            '/image': 'Режим анализа изображений активирован',
            '/analyze': 'Глубокий анализ активирован',
            '/clear': 'Очистка чата...',
            '/settings': 'Открытие настроек...'
        };
        
        const response = commands[command] || 'Неизвестная команда. Введите /help для списка команд.';
        
        if (command === '/clear') {
            this.clear();
        } else if (command === '/settings') {
            Modals.show('api-modal');
        } else {
            this.addMessage(response, 'assistant');
        }
    },

    clear: function() {
        System.messages = [];
        const container = document.getElementById('chat-messages');
        container.innerHTML = `
            <div class="welcome-message">
                <div class="message-bubble system">
                    <div class="message-header">
                        <span class="message-avatar">🤖</span>
                        <span class="message-author">NEURAL CORE</span>
                        <span class="message-time" id="current-time"></span>
                    </div>
                    <div class="message-content">
                        <h4>👾 ЧАТ ОЧИЩЕН</h4>
                        <p>История сообщений удалена. Готов к новым запросам.</p>
                    </div>
                </div>
            </div>
        `;
        
        // Очистка превью файлов
        document.getElementById('file-preview').innerHTML = '';
        
        System.updateInterface();
        System.showNotification('Чат очищен', 'success');
    },

    export: function() {
        if (System.messages.length === 0) {
            System.showNotification('Нет сообщений для экспорта', 'warning');
            return;
        }
        
        const data = {
            sessionId: System.sessionId,
            version: System.version,
            exportDate: new Date().toISOString(),
            messages: System.messages
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gridos_chat_${System.sessionId}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        System.showNotification('Чат экспортирован', 'success');
    },

    saveHistory: function() {
        if (System.settings.autoSave) {
            localStorage.setItem(`gridOS_chat_${System.sessionId}`, JSON.stringify(System.messages));
        }
    },

    loadHistory: function() {
        try {
            const saved = localStorage.getItem(`gridOS_chat_${System.sessionId}`);
            if (saved) {
                const messages = JSON.parse(saved);
                messages.forEach(msg => {
                    msg.timestamp = new Date(msg.timestamp);
                    this.renderMessage(msg);
                });
                System.messages = messages;
                System.updateInterface();
            }
        } catch (e) {
            console.warn('Не удалось загрузить историю:', e);
        }
    },

    initTypingAnimation: function() {
        const cursor = document.getElementById('typing-cursor');
        if (cursor) {
            let visible = true;
            setInterval(() => {
                visible = !visible;
                cursor.style.opacity = visible ? '1' : '0';
            }, 500);
        }
    }
};

// Модуль инструментов
const Tools = {
    toolsList: {
        NEURAL_CORE: {
            icon: '🧠',
            name: 'NEURAL CORE',
            desc: 'Основное нейросетевое ядро',
            color: '#00f7ff',
            prompt: 'Ты - ядро нейросетевой системы Nexus Core v2.0. Анализируй запросы максимально точно и эффективно.'
        },
        CYBER_ANALYST: {
            icon: '🔍',
            name: 'CYBER ANALYST',
            desc: 'Глубокий анализ данных и паттернов',
            color: '#9d00ff',
            prompt: 'Ты - аналитик киберпространства. Ищи скрытые связи, паттерны и аномалии в данных.'
        },
        CODE_MATRIX: {
            icon: '💻',
            name: 'CODE MATRIX',
            desc: 'Генерация и анализ кода',
            color: '#FFD700',
            prompt: 'Ты - система генерации кода. Пиши оптимизированный, чистый код на любых языках.'
        },
        MED_SCAN: {
            icon: '⚕️',
            name: 'MED SCAN',
            desc: 'Медицинская диагностика и анализ',
            color: '#00ff88',
            prompt: 'Ты - медицинский сканер. Анализируй симптомы, давай рекомендации (не заменяй врача!).'
        },
        CREATIVE_AI: {
            icon: '🎨',
            name: 'CREATIVE AI',
            desc: 'Креативный контент и идеи',
            color: '#ff00ff',
            prompt: 'Ты - креативный искусственный интеллект. Генерируй идеи, тексты, концепции.'
        },
        SECURITY_SCAN: {
            icon: '🛡️',
            name: 'SECURITY SCAN',
            desc: 'Анализ безопасности и угроз',
            color: '#ff003c',
            prompt: 'Ты - система безопасности. Анализируй угрозы, уязвимости, защищай данные.'
        }
    },

    load: function() {
        const container = document.getElementById('tools-container');
        container.innerHTML = '';
        
        for (const [id, tool] of Object.entries(this.toolsList)) {
            System.tools[id] = tool;
            
            const toolEl = document.createElement('div');
            toolEl.className = 'tool-card';
            toolEl.dataset.toolId = id;
            toolEl.innerHTML = `
                <div class="tool-icon" style="color: ${tool.color}">${tool.icon}</div>
                <div class="tool-name">${tool.name}</div>
                <div class="tool-desc">${tool.desc}</div>
            `;
            
            toolEl.addEventListener('click', () => this.select(id));
            
            container.appendChild(toolEl);
        }
        
        // Выбираем первый инструмент по умолчанию
        this.select('NEURAL_CORE');
    },

    select: function(toolId) {
        // Снимаем выделение со всех инструментов
        document.querySelectorAll('.tool-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Выделяем выбранный
        const selected = document.querySelector(`[data-tool-id="${toolId}"]`);
        if (selected) {
            selected.classList.add('active');
        }
        
        // Обновляем систему
        System.currentTool = toolId;
        
        // Событие для других модулей
        document.dispatchEvent(new CustomEvent('toolSelected', {
            detail: { tool: toolId }
        }));
        
        // Звуковой эффект
        if (System.settings.soundEffects) {
            Audio.play('click');
        }
        
        System.showNotification(`Инструмент активирован: ${System.tools[toolId].name}`, 'success');
    }
};

// Модуль API
const API = {
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/models/',
    
    async sendMessage(message, tool) {
        if (!System.settings.apiKey) {
            throw new Error('API ключ не настроен');
        }
        
        const model = System.settings.model;
        const url = `${this.baseURL}${model}:generateContent?key=${System.settings.apiKey}`;
        
        const toolConfig = System.tools[tool] || System.tools.NEURAL_CORE;
        const systemPrompt = toolConfig.prompt;
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nЗапрос пользователя: ${message}`
                }]
            }],
            generationConfig: {
                temperature: System.settings.temperature,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: System.settings.responseLength === 'short' ? 500 : 
                                 System.settings.responseLength === 'medium' ? 1500 : 4000
            },
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
            ]
        };
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Неверный формат ответа от API');
            }
            
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    async testConnection() {
        try {
            System.showNotification('Проверка соединения с API...', 'info');
            
            const response = await this.sendMessage('Тестовое сообщение', 'NEURAL_CORE');
            
            if (response && response.includes('Тестовое')) {
                System.showNotification('✅ Соединение с API установлено', 'success');
                document.getElementById('api-status').textContent = 'CONNECTED';
                document.getElementById('system-status').textContent = 'ONLINE';
                return true;
            } else {
                throw new Error('Неверный ответ от API');
            }
        } catch (error) {
            System.showNotification(`❌ Ошибка соединения: ${error.message}`, 'error');
            document.getElementById('api-status').textContent = 'DISCONNECTED';
            document.getElementById('system-status').textContent = 'OFFLINE';
            return false;
        }
    }
};

// Модуль эффектов
const Effects = {
    matrixCanvas: null,
    matrixCtx: null,
    matrixInterval: null,
    
    startMatrix: function() {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        
        this.matrixCanvas = canvas;
        this.matrixCtx = canvas.getContext('2d');
        
        // Устанавливаем размеры canvas
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Символы для матрицы
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
        const charArray = chars.split("");
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        // Инициализация капель
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
        
        // Отрисовка матрицы
        const draw = () => {
            // Полупрозрачный черный фон для эффекта следа
            this.matrixCtx.fillStyle = "rgba(10, 10, 15, 0.04)";
            this.matrixCtx.fillRect(0, 0, canvas.width, canvas.height);
            
            this.matrixCtx.font = `${fontSize}px 'JetBrains Mono', monospace`;
            
            for (let i = 0; i < drops.length; i++) {
                // Случайный символ
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                
                // Цвет: зеленый для новых, белый для старых
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                const opacity = Math.min(1, drops[i] * 0.1);
                const color = drops[i] < 3 ? 
                    `rgba(0, 255, 136, ${opacity})` : 
                    `rgba(0, 247, 255, ${opacity})`;
                
                this.matrixCtx.fillStyle = color;
                this.matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                drops[i]++;
            }
        };
        
        this.matrixInterval = setInterval(draw, 33); // ~30 FPS
    },
    
    startScanLines: function() {
        const scanLine = document.querySelector('.scan-line');
        if (scanLine) {
            scanLine.style.animation = 'scan 3s linear infinite';
        }
    },
    
    stopAll: function() {
        if (this.matrixInterval) {
            clearInterval(this.matrixInterval);
        }
    }
};

// === ИСПРАВЛЕННЫЙ МОДУЛЬ АУДИО (SoundManager) ===
const SoundManager = {  // БЫЛО: const Audio = {
    sounds: {},
    
    init: function() {
        try {
            // Предзагрузка звуков
            this.sounds = {
                click: new window.Audio('assets/sounds/click.wav'), // Явно вызываем window.Audio
                hover: new window.Audio('assets/sounds/hover.wav'),
                notification: new window.Audio('assets/sounds/notification.mp3'),
                typing: new window.Audio('assets/sounds/typing.mp3')
            };
            
            // Настройка громкости
            Object.values(this.sounds).forEach(sound => {
                sound.volume = 0.3;
            });
            console.log("🔊 Звуковой модуль готов");
        } catch (e) {
            console.warn("Звуки не загрузились (файлы отсутствуют?)", e);
        }
    },
    
    play: function(soundName) {
        if (!System.settings || !System.settings.soundEffects) return;
        
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {}); // Игнорируем ошибки автовоспроизведения
        }
    }
};

// Модуль модальных окон
const Modals = {
    show: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    
    hide: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
};

// Модуль часов
const Clock = {
    update: function() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const dateString = now.toLocaleDateString('ru-RU', {
            weekday: 'short',
            day: '2-digit',
            month: 'short'
        }).toUpperCase();
        
        document.getElementById('current-clock').textContent = timeString;
        document.getElementById('current-time').textContent = timeString;
        
        // Обновление заголовка каждую секунду
        setTimeout(this.update, 1000);
    }
};
    // Адаптация к изменению размера окна
    window.addEventListener('resize', function() {
        if (Effects.matrixCanvas) {
            Effects.matrixCanvas.width = window.innerWidth;
            Effects.matrixCanvas.height = window.innerHeight;
        }
    });
    
    // Обработка нажатия ESC для закрытия модальных окон
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });