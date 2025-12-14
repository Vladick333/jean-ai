// effects.js - Визуальные эффекты (Passive Mode)
const Effects = {
    matrixCanvas: null,
    matrixCtx: null,
    matrixInterval: null,
    
    // Главная функция запуска всех эффектов
    init: function() {
        console.log('🎨 [EFFECTS] Запуск визуального ядра...');
        this.startMatrix();
        this.startScanLines();
        this.startParticles();
        this.startGlitchEffect();
        this.startTerminalTyping();
        this.startDataStream();
        
        // Добавляем слушатели на кнопки
        this.attachButtonEffects();
    },
    
    startMatrix: function() {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        
        // Если уже запущено - очищаем старое, чтобы не было ускорения
        if (this.matrixInterval) clearInterval(this.matrixInterval);

        this.matrixCanvas = canvas;
        this.matrixCtx = canvas.getContext('2d');
        
        this.resizeCanvas();
        
        const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
        const charArray = chars.split("");
        const fontSize = 14;
        const columns = this.matrixCanvas.width / fontSize;
        const drops = [];
        
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * 100;
        }
        
        const drawMatrix = () => {
            this.matrixCtx.fillStyle = "rgba(10, 10, 15, 0.04)";
            this.matrixCtx.fillRect(0, 0, this.matrixCanvas.width, this.matrixCanvas.height);
            
            this.matrixCtx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`;
            this.matrixCtx.textAlign = 'center';
            
            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;
                
                const gradient = this.matrixCtx.createLinearGradient(0, y, 0, y + fontSize);
                
                if (drops[i] * fontSize > this.matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                const opacity = Math.min(1, (drops[i] * 0.1) % 1);
                
                if (opacity < 0.3) {
                    gradient.addColorStop(0, `rgba(0, 255, 136, ${opacity})`);
                    gradient.addColorStop(1, `rgba(0, 255, 136, ${opacity * 0.5})`);
                } else {
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
                    gradient.addColorStop(1, `rgba(0, 247, 255, ${opacity * 0.7})`);
                }
                
                this.matrixCtx.fillStyle = gradient;
                this.matrixCtx.fillText(text, x + fontSize/2, y);
                this.matrixCtx.shadowBlur = 15;
                this.matrixCtx.shadowColor = opacity < 0.3 ? '#00ff88' : '#00f7ff';
                
                drops[i] += 0.5 + Math.random() * 0.5;
            }
            this.matrixCtx.shadowBlur = 0;
        };
        
        this.matrixInterval = setInterval(drawMatrix, 50);
        window.addEventListener('resize', () => this.resizeCanvas());
    },
    
    resizeCanvas: function() {
        if (this.matrixCanvas) {
            this.matrixCanvas.width = window.innerWidth;
            this.matrixCanvas.height = window.innerHeight;
        }
    },
    
    startScanLines: function() {
        const header = document.querySelector('.cyber-header');
        if (!header || header.querySelector('.scan-line-extra')) return; // Защита от дублей
        
        for (let i = 0; i < 3; i++) {
            const line = document.createElement('div');
            line.className = 'scan-line scan-line-extra'; // Доп класс для проверки
            line.style.position = 'absolute';
            line.style.height = '1px';
            line.style.width = '100%';
            line.style.background = `linear-gradient(90deg, transparent, rgba(${i === 0 ? '0,247,255' : i === 1 ? '157,0,255' : '255,215,0'}, 0.8), transparent)`;
            line.style.top = `${20 + i * 15}%`;
            line.style.animation = `scan ${3 + i}s linear infinite`;
            line.style.animationDelay = `${i}s`;
            header.appendChild(line);
        }
    },
    
    startParticles: function() {
        const container = document.getElementById('background-effects');
        if (!container) return;
        
        // Удаляем старый канвас если есть
        const oldCanvas = document.getElementById('particles-canvas');
        if (oldCanvas) oldCanvas.remove();

        const canvas = document.createElement('canvas');
        canvas.id = 'particles-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: `rgba(${Math.random() > 0.5 ? '0,247,255' : '157,0,255'}, ${Math.random() * 0.3 + 0.1})`
            });
        }
        
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                
                particles.forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 247, 255, ${0.1 * (1 - distance/100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });
            requestAnimationFrame(animateParticles);
        };
        
        animateParticles();
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    },
    
    startGlitchEffect: function() {
        const glitchElements = document.querySelectorAll('.cyber-title, .tool-name, .message-author');
        glitchElements.forEach(element => {
            setInterval(() => {
                if (Math.random() > 0.95) {
                    const originalText = element.textContent;
                    const glitchChars = '!@#$%^&*<>?/\\|';
                    let glitchText = '';
                    for (let i = 0; i < originalText.length; i++) {
                        if (Math.random() > 0.7) {
                            glitchText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        } else {
                            glitchText += originalText[i];
                        }
                    }
                    element.textContent = glitchText;
                    element.style.textShadow = '0 0 10px #ff0000';
                    setTimeout(() => {
                        element.textContent = originalText;
                        element.style.textShadow = '';
                    }, 100);
                }
            }, 1000);
        });
    },
    
    startTerminalTyping: function() {
        const terminalPrompt = document.querySelector('.terminal-prompt');
        if (!terminalPrompt) return;
        
        // Предотвращаем повторный запуск
        if (terminalPrompt.getAttribute('data-typing') === 'true') return;
        terminalPrompt.setAttribute('data-typing', 'true');

        // Простая логика курсора (без сложного перепечатывания, чтобы не ломать верстку)
        setInterval(() => {
            const cursor = document.getElementById('typing-cursor');
            if (cursor) {
                cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
            }
        }, 500);
    },
    
    createRippleEffect: function(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size/2;
        const y = event.clientY - rect.top - size/2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            top: ${y}px;
            left: ${x}px;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    },
    
    startDataStream: function() {
        const statusValues = [
            document.getElementById('ram-usage'),
            document.getElementById('ssd-usage'),
            document.getElementById('cpu-temp')
        ];
        
        setInterval(() => {
            statusValues.forEach(element => {
                if (element && Math.random() > 0.7) {
                    const originalValue = element.textContent;
                    const value = parseInt(originalValue);
                    const change = Math.random() > 0.5 ? 1 : -1;
                    const newValue = Math.max(0, Math.min(100, value + change));
                    
                    element.textContent = newValue + (originalValue.includes('%') ? '%' : '°C');
                    element.style.color = change > 0 ? '#00ff88' : '#ff003c';
                    
                    setTimeout(() => {
                        element.style.color = '';
                    }, 500);
                }
            });
        }, 2000);
    },

    attachButtonEffects: function() {
        document.querySelectorAll('.cyber-btn, .tool-card, .quick-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(button, e);
            });
        });
    }
};

// Добавляем стили анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to { transform: scale(4); opacity: 0; }
    }
    @keyframes scan {
        0% { top: 0%; opacity: 0; }
        50% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
    }
`;
document.head.appendChild(style);

// Экспорт
window.Effects = Effects;