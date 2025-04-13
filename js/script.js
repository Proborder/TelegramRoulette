// Initialize Telegram WebApp
Telegram.WebApp.ready();
Telegram.WebApp.expand();

// Wheel configuration
const wheelItems = [
    { text: "Custom video", color: "#FF5252", textColor: "#FFFFFF" },
    { text: "Mastur ass", color: "#FF9800", textColor: "#FFFFFF" },
    { text: "Mastur pussy", color: "#FFEB3B", textColor: "#000000" },
    { text: "BJ", color: "#4CAF50", textColor: "#FFFFFF" },
    { text: "1", color: "#2196F3", textColor: "#FFFFFF" },
    { text: "1", color: "#2196F3", textColor: "#FFFFFF" },
    { text: "1", color: "#2196F3", textColor: "#FFFFFF" },
    { text: "Nothing", color: "#2196F3", textColor: "#FFFFFF" }
];

// Game state
let spinsLeft = 0;
let isSpinning = false;
let wheel = document.querySelector('.wheel');
let spinButton = document.getElementById('spinButton');
let spinsCounter = document.getElementById('spinsCounter');
let promoInput = document.getElementById('promoInput');
let promoButton = document.getElementById('promoButton');

// Init Wheel
function initWheel() {
    // Очищаем колесо перед генерацией
    wheel.innerHTML = '';
    
    // Генерируем сегменты колеса
    wheelItems.forEach((item, index) => {
        // Создаем элемент сегмента
        const segment = document.createElement('div');
        segment.className = 'number';
        
        // Устанавливаем CSS-переменные
        segment.style.setProperty('--i', index + 1);
        segment.style.setProperty('--clr', item.color);
        
        // Создаем элемент текста
        const span = document.createElement('span');
        span.textContent = item.text;
        span.style.color = item.textColor;
        
        // Добавляем сегмент
        segment.appendChild(span);
        wheel.appendChild(segment);
    });
};

function spinWheel() {
    if (isSpinning || spinsLeft <= 0) return;
    
    spinsLeft--;
    updateSpinsCounter();
    isSpinning = true;
    spinButton.disabled = true;
    
    // Минимум 1 полный оборот (360°) + случайное значение от 360° до 3600°
    const minSpin = 360;
    const additionalSpin = Math.random() * 3240; // 3600 - 360 = 3240
    const totalSpin = minSpin + additionalSpin;
    
    wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    wheel.style.transform = `rotate(-${totalSpin}deg)`;
    
    setTimeout(() => {
        isSpinning = false;
        spinButton.disabled = false;
    }, 4000);
}

// Update spins counter display
function updateSpinsCounter() {
    spinsCounter.textContent = `Доступно вращений: ${spinsLeft}`;
    
    if (spinsLeft > 0) {
        spinsCounter.classList.add('pulse');
    } else {
        spinsCounter.classList.remove('pulse');
    }
}

// Apply promo code
function applyPromoCode() {
    const promoCode = promoInput.value.trim();
    
    if (!promoCode) {
        return;
    }

    const promo = { action: "validate_promo", promo_code: promoCode };
    Telegram.WebApp.postEvent("validate_promo", JSON.stringify(promo));
    
    promoInput.value = '';
}

// Ждем сообщения от бота
Telegram.WebApp.onEvent('messageReceived', (msg) => {
    if (msg.text.startsWith('webapp_response:')) {
        const response = JSON.parse(msg.text.replace('webapp_response:', ''));
        
        // Обновляем интерфейс WebApp
        if (response.status === "success") {
            spinsLeft += response.spins;
            updateSpinsCounter();
        }
    }
});

// Event listeners
spinButton.addEventListener('click', spinWheel);
promoButton.addEventListener('click', applyPromoCode);
promoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') applyPromoCode();
});

initWheel();
