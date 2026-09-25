/* ===== NAVEGACIÓN MÓVIL ===== */
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

/* ===== VELA SORPRESA ===== */
const blowBtn = document.getElementById('blowBtn');
const flame = document.getElementById('flame');
const flameGlow = document.querySelector('.flame-glow');
const candleMessage = document.getElementById('candleMessage');

const messages = [
    "¡Que todos tus deseos se hagan realidad! 🌟",
    "¡Este año será el mejor de todos! 💕",
    "¡Que la vida te siga sonriendo siempre! 🌸",
    "¡Brindo por ti y por todos tus sueños! 🥂",
    "¡Feliz cumpleaños, persona maravillosa! 🎂"
];

blowBtn.addEventListener('click', () => {
    flame.classList.add('blown');
    flameGlow.classList.add('blown');
    
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    candleMessage.textContent = randomMsg;
    candleMessage.classList.add('show');
    
    // Lanzar confeti
    launchConfetti();
    
    // Reiniciar después de 5 segundos
    setTimeout(() => {
        flame.classList.remove('blown');
        flameGlow.classList.remove('blown');
        candleMessage.classList.remove('show');
    }, 5000);
});

/* ===== LIBRO DE DESEOS ===== */
const wishForm = document.getElementById('wishForm');
const wishesList = document.getElementById('wishesList');

// Cargar deseos guardados
function loadWishes() {
    const wishes = JSON.parse(localStorage.getItem('birthdayWishes') || '[]');
    wishesList.innerHTML = '';
    
    if (wishes.length === 0) {
        wishesList.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--brown-light);font-style:italic;">Sé la primera persona en dejar un deseo 💌</p>';
        return;
    }
    
    wishes.forEach(wish => {
        const card = document.createElement('div');
        card.className = 'wish-card';
        card.innerHTML = `
            <h4>${escapeHTML(wish.name)}</h4>
            <p>${escapeHTML(wish.message)}</p>
        `;
        wishesList.appendChild(card);
    });
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('wishName').value.trim();
    const message = document.getElementById('wishMessage').value.trim();
    
    if (!name || !message) return;
    
    const wishes = JSON.parse(localStorage.getItem('birthdayWishes') || '[]');
    wishes.unshift({ name, message, date: new Date().toISOString() });
    localStorage.setItem('birthdayWishes', JSON.stringify(wishes));
    
    wishForm.reset();
    loadWishes();
    launchConfetti();
});

loadWishes();

/* ===== CONFETI ===== */
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let confettiPieces = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const confettiColors = ['#FFB6C1', '#FFE4E1', '#F5DEB3', '#F8A5B8', '#FFF5E6'];

class Confetti {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 2;
        this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
        ctx.restore();
    }
}

function launchConfetti() {
    for (let i = 0; i < 100; i++) {
        confettiPieces.push(new Confetti());
    }
    if (!animationId) animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confettiPieces = confettiPieces.filter(c => c.y < canvas.height);
    
    confettiPieces.forEach(c => {
        c.update();
        c.draw();
    });
    
    if (confettiPieces.length > 0) {
        animationId = requestAnimationFrame(animateConfetti);
    } else {
        animationId = null;
    }
}

/* ===== ANIMACIÓN AL HACER SCROLL ===== */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.timeline-item, .gallery-item, .confession-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

/* ===== SORPRESA: SOPlar CON MICRO (opcional) ===== */
if ('webkitAudioContext' in window || 'AudioContext' in window) {
    const tryMic = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioCtx();
            const analyser = audioCtx.createAnalyser();
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;
            const data = new Uint8Array(analyser.frequencyBinCount);
            
            const checkBlow = () => {
                analyser.getByteFrequencyData(data);
                const avg = data.reduce((a, b) => a + b, 0) / data.length;
                if (avg > 80 && !flame.classList.contains('blown')) {
                    blowBtn.click();
                }
                requestAnimationFrame(checkBlow);
            };
            checkBlow();
        } catch (err) {
            console.log('Mic no disponible, usamos el botón');
        }
    };
    // Activar solo cuando el usuario interactúe
    document.getElementById('vela').addEventListener('click', tryMic, { once: true });
}
