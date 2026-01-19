// Language switching functionality
let currentLang = 'vi';

function initLanguage() {
    const savedLang = localStorage.getItem('preferredLang') || 'vi';
    switchLanguage(savedLang);
}

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLang', lang);
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

// Initialize language switcher buttons
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchLanguage(btn.dataset.lang);
        });
    });
});

// Waveform animation for hero section
function initHeroWaveform() {
    const canvas = document.getElementById('waveform-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    let animationId;
    let time = 0;
    
    function drawWaveform() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.lineWidth = 2;
        
        const centerY = height / 2;
        const frequency = 0.02;
        const amplitude = 30;
        
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
            const y = centerY + Math.sin((x * frequency) + time) * amplitude * 
                      Math.sin(x * 0.01 + time * 0.5);
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Draw multiple layers for depth
        for (let layer = 1; layer <= 3; layer++) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 / layer})`;
            for (let x = 0; x < width; x++) {
                const y = centerY + Math.sin((x * frequency * layer) + time * layer) * 
                          (amplitude / layer) * Math.sin(x * 0.01 + time * 0.5);
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
        
        time += 0.05;
        animationId = requestAnimationFrame(drawWaveform);
    }
    
    drawWaveform();
    
    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
}

// Audio card waveform visualization
function initAudioWaveforms() {
    const waveforms = document.querySelectorAll('.waveform');
    
    waveforms.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        function drawWaveform() {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
            
            const barCount = 40;
            const barWidth = width / barCount;
            const centerY = height / 2;
            
            for (let i = 0; i < barCount; i++) {
                const barHeight = Math.random() * height * 0.6;
                const x = i * barWidth + barWidth * 0.2;
                const y = centerY - barHeight / 2;
                const barW = barWidth * 0.6;
                
                ctx.fillRect(x, y, barW, barHeight);
            }
        }
        
        drawWaveform();
        
        // Animate waveform
        setInterval(() => {
            drawWaveform();
        }, 200);
    });
}

// Audio player functionality
let currentAudio = null;
let currentButton = null;

function initAudioPlayers() {
    const playButtons = document.querySelectorAll('.play-btn');
    
    playButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const audioSrc = btn.getAttribute('data-audio');
            const audioCard = btn.closest('.audio-card');
            const progressBar = audioCard.querySelector('.progress-bar');
            
            // If clicking the same button that's playing, pause it
            if (btn === currentButton && currentAudio && !currentAudio.paused) {
                currentAudio.pause();
                btn.classList.remove('playing');
                return;
            }
            
            // Stop any currently playing audio
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                if (currentButton) {
                    currentButton.classList.remove('playing');
                    const prevCard = currentButton.closest('.audio-card');
                    if (prevCard) {
                        prevCard.querySelector('.progress-bar').style.width = '0%';
                    }
                }
            }
            
            // Create and play new audio
            currentAudio = new Audio(audioSrc);
            currentButton = btn;
            
            currentAudio.addEventListener('loadedmetadata', () => {
                currentAudio.play();
                btn.classList.add('playing');
            });
            
            currentAudio.addEventListener('timeupdate', () => {
                const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
                progressBar.style.width = progress + '%';
            });
            
            currentAudio.addEventListener('ended', () => {
                btn.classList.remove('playing');
                progressBar.style.width = '0%';
                currentAudio = null;
                currentButton = null;
            });
            
            currentAudio.addEventListener('error', (e) => {
                console.error('Error loading audio:', e);
                btn.classList.remove('playing');
                progressBar.style.width = '0%';
            });
            
            // Start loading and playing
            currentAudio.load();
        });
    });
}

// Pricing tabs
function initPricingTabs() {
    const tabs = document.querySelectorAll('.pricing-tab');
    const contents = document.querySelectorAll('.pricing-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            contents.forEach(content => {
                content.classList.remove('active');
            });
            
            const targetContent = document.getElementById(`${targetTab}-pricing`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for fade-in animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.highlight-card, .feature-item, .audio-card, .pricing-card, .spec-item, .author-card').forEach(el => {
        observer.observe(el);
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        }
        
        lastScroll = currentScroll;
    });
}

// Particle System
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.5 ? 'rgba(139, 92, 246, ' : 'rgba(59, 130, 246, ';
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Animated Counter
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Custom Cursor
function initCustomCursor() {
    if (window.innerWidth < 768) return; // Skip on mobile
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor follow
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .highlight-card, .feature-item, .audio-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.glowing-orb, .hero-content');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        parallaxElements.forEach((element, index) => {
            if (element.classList.contains('glowing-orb')) {
                const speed = (index + 1) * 0.1;
                element.style.transform = `translateY(${rate * speed}px)`;
            }
        });
    });
}

// Enhanced Audio Waveform
function enhanceAudioWaveforms() {
    const waveforms = document.querySelectorAll('.waveform');
    
    waveforms.forEach((canvas, index) => {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        let animationFrame;
        let time = 0;
        let isPlaying = false;
        
        // Link to play button
        const playBtn = canvas.closest('.audio-card')?.querySelector('.play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                isPlaying = !isPlaying;
                if (isPlaying) {
                    drawWaveform();
                }
            });
        }
        
        function drawWaveform() {
            ctx.clearRect(0, 0, width, height);
            
            const barCount = 40;
            const barWidth = width / barCount;
            const centerY = height / 2;
            
            for (let i = 0; i < barCount; i++) {
                const frequency = 0.2 + (index * 0.1);
                const amplitude = isPlaying ? 0.8 : 0.3;
                const barHeight = (Math.sin((i * frequency) + time) * amplitude + 0.5) * height * 0.6 + height * 0.1;
                const x = i * barWidth + barWidth * 0.2;
                const y = centerY - barHeight / 2;
                const barW = barWidth * 0.6;
                
                // Gradient effect
                const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
                gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
                gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.7)');
                gradient.addColorStop(1, 'rgba(139, 92, 246, 0.5)');
                ctx.fillStyle = gradient;
                
                // Rounded corners
                ctx.beginPath();
                ctx.roundRect(x, y, barW, barHeight, 2);
                ctx.fill();
            }
            
            time += isPlaying ? 0.15 : 0.05;
            animationFrame = requestAnimationFrame(drawWaveform);
        }
        
        drawWaveform();
        
        // Pause animation when not visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    cancelAnimationFrame(animationFrame);
                } else {
                    drawWaveform();
                }
            });
        });
        observer.observe(canvas);
    });
}

// Magnetic Button Effect
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    initHeroWaveform();
    initParticles();
    initAudioWaveforms();
    enhanceAudioWaveforms();
    initAudioPlayers();
    initPricingTabs();
    initSmoothScroll();
    initScrollAnimations();
    initNavbarScroll();
    initAnimatedCounters();
    initCustomCursor();
    initParallax();
    initMagneticButtons();
});

