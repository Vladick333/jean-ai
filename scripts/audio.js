// audio.js - Управление звуком
const AudioSystem = {
    sounds: {},
    context: null,
    masterVolume: 0.3,
    enabled: true,
    
    init: function() {
        console.log('🔊 Инициализация аудио системы');
        
        try {
            // Создаем AudioContext
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            
            // Предзагрузка звуков
            this.loadSounds();
            
            // Восстановление контекста при взаимодействии с пользователем
            document.addEventListener('click', () => this.resumeContext(), { once: true });
            
            // Загрузка настроек
            this.loadSettings();
            
        } catch (error) {
            console.warn('Аудио система недоступна:', error);
            this.enabled = false;
        }
    },
    
    loadSettings: function() {
        try {
            const saved = localStorage.getItem('audioSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.masterVolume = settings.volume || 0.3;
                this.enabled = settings.enabled !== false;
            }
        } catch (e) {
            console.warn('Не удалось загрузить настройки звука');
        }
    },
    
    saveSettings: function() {
        try {
            localStorage.setItem('audioSettings', JSON.stringify({
                volume: this.masterVolume,
                enabled: this.enabled
            }));
        } catch (e) {
            console.warn('Не удалось сохранить настройки звука');
        }
    },
    
    loadSounds: function() {
        // Создаем базовые звуки программно
        this.createBeepSound('click', 800, 0.1);
        this.createBeepSound('hover', 1200, 0.05);
        this.createBeepSound('notification', 600, 0.2);
        this.createBeepSound('success', 1000, 0.15);
        this.createBeepSound('error', 400, 0.2);
        this.createBeepSound('power', 150, 0.3);
        this.createBeepSound('scan', 2000, 0.1);
        
        // Создаем звук печатания
        this.createTypingSound();
        
        // Создаем фоновую музыку
        this.createBackgroundMusic();
    },
    
    createBeepSound: function(name, frequency, duration) {
        if (!this.enabled || !this.context) return;
        
        this.sounds[name] = {
            play: () => {
                try {
                    const oscillator = this.context.createOscillator();
                    const gainNode = this.context.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.context.destination);
                    
                    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0, this.context.currentTime);
                    gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.5, this.context.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
                    
                    oscillator.start(this.context.currentTime);
                    oscillator.stop(this.context.currentTime + duration);
                    
                } catch (error) {
                    console.warn('Ошибка воспроизведения звука:', error);
                }
            }
        };
    },
    
    createTypingSound: function() {
        this.sounds.typing = {
            isPlaying: false,
            interval: null,
            
            play: function() {
                if (this.isPlaying) return;
                
                this.isPlaying = true;
                let clickCount = 0;
                
                this.interval = setInterval(() => {
                    // Случайная частота для разнообразия
                    const freq = 800 + Math.random() * 800;
                    const oscillator = AudioSystem.context.createOscillator();
                    const gainNode = AudioSystem.context.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(AudioSystem.context.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, AudioSystem.context.currentTime);
                    oscillator.type = 'sawtooth';
                    
                    gainNode.gain.setValueAtTime(0, AudioSystem.context.currentTime);
                    gainNode.gain.linearRampToValueAtTime(AudioSystem.masterVolume * 0.2, AudioSystem.context.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, AudioSystem.context.currentTime + 0.05);
                    
                    oscillator.start(AudioSystem.context.currentTime);
                    oscillator.stop(AudioSystem.context.currentTime + 0.05);
                    
                    clickCount++;
                    if (clickCount > 15) { // Ограничиваем количество кликов
                        this.stop();
                    }
                }, 100);
            },
            
            stop: function() {
                if (this.interval) {
                    clearInterval(this.interval);
                    this.interval = null;
                }
                this.isPlaying = false;
            }
        };
    },
    
    createBackgroundMusic: function() {
        // Создаем простую фоновую музыку в стиле киберпанк
        this.sounds.background = {
            isPlaying: false,
            nodes: [],
            
            play: function() {
                if (this.isPlaying || !AudioSystem.enabled) return;
                
                this.isPlaying = true;
                const context = AudioSystem.context;
                
                // Создаем несколько осцилляторов для аккорда
                const frequencies = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3
                
                frequencies.forEach((freq, index) => {
                    const oscillator = context.createOscillator();
                    const gainNode = context.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(context.destination);
                    
                    oscillator.frequency.setValueAtTime(freq, context.currentTime);
                    oscillator.type = 'sawtooth';
                    
                    // Медленное изменение частоты для эффекта
                    oscillator.frequency.setValueAtTime(freq, context.currentTime);
                    oscillator.frequency.linearRampToValueAtTime(freq * 1.01, context.currentTime + 2);
                    
                    // Низкая громкость и вибрато
                    gainNode.gain.setValueAtTime(AudioSystem.masterVolume * 0.02, context.currentTime);
                    
                    // LFO для вибрато
                    const lfo = context.createOscillator();
                    const lfoGain = context.createGain();
                    
                    lfo.connect(lfoGain);
                    lfoGain.connect(oscillator.frequency);
                    
                    lfo.frequency.setValueAtTime(5 + index, context.currentTime);
                    lfoGain.gain.setValueAtTime(0.5, context.currentTime);
                    
                    oscillator.start();
                    lfo.start();
                    
                    this.nodes.push({ oscillator, gainNode, lfo, lfoGain });
                });
                
                // Плавное затухание каждые 30 секунд
                setTimeout(() => this.fadeOut(), 30000);
            },
            
            fadeOut: function() {
                const context = AudioSystem.context;
                const fadeTime = 2;
                const now = context.currentTime;
                
                this.nodes.forEach(node => {
                    node.gainNode.gain.exponentialRampToValueAtTime(0.001, now + fadeTime);
                });
                
                setTimeout(() => {
                    this.stop();
                    // Перезапускаем через паузу
                    setTimeout(() => this.play(), 5000);
                }, fadeTime * 1000);
            },
            
            stop: function() {
                this.nodes.forEach(node => {
                    try {
                        node.oscillator.stop();
                        node.lfo.stop();
                    } catch (e) {}
                });
                this.nodes = [];
                this.isPlaying = false;
            }
        };
    },
    
    play: function(soundName, volume = null) {
        if (!this.enabled || !this.context || !this.sounds[soundName]) return;
        
        try {
            this.resumeContext();
            this.sounds[soundName].play();
        } catch (error) {
            console.warn('Ошибка воспроизведения:', soundName, error);
        }
    },
    
    resumeContext: function() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume().catch(console.error);
        }
    },
    
    setVolume: function(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    },
    
    toggle: function() {
        this.enabled = !this.enabled;
        this.saveSettings();
        
        if (!this.enabled) {
            this.stopAll();
        }
        
        return this.enabled;
    },
    
    stopAll: function() {
        Object.values(this.sounds).forEach(sound => {
            if (sound.stop) sound.stop();
        });
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    AudioSystem.init();
    
    // Запускаем фоновую музыку через 5 секунд
    setTimeout(() => {
        if (AudioSystem.enabled) {
            AudioSystem.sounds.background.play();
        }
    }, 5000);
});

// Глобальные функции для удобства
window.playSound = (name) => AudioSystem.play(name);
window.toggleAudio = () => AudioSystem.toggle();
window.setAudioVolume = (volume) => AudioSystem.setVolume(volume);

// Экспорт
window.AudioSystem = AudioSystem;