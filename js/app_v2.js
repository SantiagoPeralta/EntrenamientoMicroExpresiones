// Estado de la aplicación
let currentState = {
    difficulty: 'easy',
    randomMode: true,
    currentSubject: null,
    currentEmotion: null,
    currentAngle: 'F',
    currentPosition: 'L',
    neutralImage: null,
    expressionImage: null,
    selectedEmotion: null,
    isShowingExpression: false,
    score: 0,
    attempts: 0,
    timer: null
};

// Elementos DOM
const neutralImg = document.getElementById('neutralImage');
const expressionImg = document.getElementById('expressionImage');
const timerBar = document.getElementById('timerBar');
const startBtn = document.getElementById('startBtn');
const checkBtn = document.getElementById('checkBtn');
const resultDiv = document.getElementById('result');
const scoreSpan = document.getElementById('score');
const attemptsSpan = document.getElementById('attempts');
const accuracySpan = document.getElementById('accuracy');
const randomModeCheck = document.getElementById('randomMode');
const exposureTimeInput = document.getElementById('exposureTime');

/**
 * Establece el nivel de dificultad
 * @param {string} level - Nivel de dificultad ('easy', 'medium', 'hard')
 */
function setDifficulty(level) {
    currentState.difficulty = level;
    
    // Actualizar botones
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    resetTrial();
}

/**
 * Activa/desactiva el modo random
 */
function toggleRandomMode() {
    currentState.randomMode = randomModeCheck.checked;
    resetTrial();
}

/**
 * Selecciona una emoción
 * @param {string} emotion - Código de la emoción seleccionada
 */
function selectEmotion(emotion) {
    currentState.selectedEmotion = emotion;
    
    // Actualizar botones
    document.querySelectorAll('.emotion-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

/**
 * Inicia un nuevo ensayo
 */
function startTrial() {
    // Resetear UI
    resultDiv.style.display = 'none';
    checkBtn.disabled = false;
    startBtn.disabled = true;
    
    // Quitar selección de emoción
    currentState.selectedEmotion = null;
    document.querySelectorAll('.emotion-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Seleccionar sujeto
    if (currentState.randomMode) {
        currentState.currentSubject = getRandomSubject();
    } else {
        currentState.currentSubject = 'AF03';
    }
    
    // Seleccionar emoción aleatoria (excluyendo NEUTRAL)
    const emotions = Object.keys(KDEF_CONFIG.emotions).filter(e => e !== 'NE');
    currentState.currentEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    // Seleccionar ángulo según dificultad
    const allowedAngles = KDEF_CONFIG.angles[currentState.difficulty].allowed;
    currentState.currentAngle = allowedAngles[Math.floor(Math.random() * allowedAngles.length)];
    
    // Para nivel medio: forzar lado derecho (R)
    if (currentState.difficulty === 'medium') {
        currentState.currentPosition = 'R';
    } else {
        currentState.currentPosition = KDEF_CONFIG.positions[Math.floor(Math.random() * KDEF_CONFIG.positions.length)];
    }
    
    // Construir rutas de imágenes (mismo sujeto y mismo ángulo)
    const neutralPath = getImagePath(
        currentState.currentSubject, 
        'NE', 
        currentState.currentAngle, 
        currentState.currentPosition
    );
    
    const expressionPath = getImagePath(
        currentState.currentSubject, 
        currentState.currentEmotion, 
        currentState.currentAngle, 
        currentState.currentPosition
    );
    
    // Cargar imágenes
    neutralImg.src = neutralPath;
    expressionImg.src = expressionPath;
    
    // Manejar errores de carga
    neutralImg.onerror = function() {
        console.warn('No se pudo cargar:', neutralPath);
        const oppositePosition = getOppositePosition(currentState.currentPosition);
        neutralImg.src = getImagePath(
            currentState.currentSubject, 
            'NE', 
            currentState.currentAngle, 
            oppositePosition
        );
    };
    
    expressionImg.onerror = function() {
        console.warn('No se pudo cargar:', expressionPath);
        const oppositePosition = getOppositePosition(currentState.currentPosition);
        expressionImg.src = getImagePath(
            currentState.currentSubject, 
            currentState.currentEmotion, 
            currentState.currentAngle, 
            oppositePosition
        );
    };
    
    // Asegurar que la neutral está visible
    neutralImg.classList.add('active');
    expressionImg.classList.remove('active');
    
    // Actualizar información del ensayo
    updateTrialInfo(currentState);
    
    // Registrar en consola
    logTrialInfo(currentState);
    
    // Programar cambio de imagen
    const exposureTime = parseInt(exposureTimeInput.value);
    
    // Iniciar animación de la barra
    timerBar.style.width = '0%';
    timerBar.style.transition = `width ${exposureTime}ms linear`;
    
    setTimeout(() => {
        timerBar.style.width = '100%';
    }, 10);
    
    // Cambiar a expresión
    setTimeout(() => {
        neutralImg.classList.remove('active');
        expressionImg.classList.add('active');
        currentState.isShowingExpression = true;
        
        // Volver a neutral después del tiempo de exposición
        setTimeout(() => {
            expressionImg.classList.remove('active');
            neutralImg.classList.add('active');
            currentState.isShowingExpression = false;
            
            // Resetear barra
            timerBar.style.transition = 'none';
            timerBar.style.width = '0%';
        }, exposureTime);
    }, 500);
}

/**
 * Comprueba si la respuesta es correcta
 */
function checkAnswer() {
    if (!currentState.selectedEmotion) {
        alert('Por favor, selecciona una emoción');
        return;
    }
    
    currentState.attempts++;
    const isCorrect = currentState.selectedEmotion === currentState.currentEmotion;
    
    if (isCorrect) {
        currentState.score++;
    }
    
    // Mostrar resultado
    resultDiv.style.display = 'block';
    resultDiv.className = `result ${isCorrect ? 'success' : 'error'}`;
    
    const correctEmotion = KDEF_CONFIG.emotions[currentState.currentEmotion];
    const selectedEmotion = KDEF_CONFIG.emotions[currentState.selectedEmotion];
    
    if (isCorrect) {
        resultDiv.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <i class="bi bi-check-circle-fill fs-4"></i>
                <strong>¡Correcto!</strong> Has identificado ${correctEmotion.name}
            </div>
            <div class="feedback-content">
                <div class="key-features">
                    <h6><i class="bi bi-lightbulb"></i> Claves para identificar ${correctEmotion.name}:</h6>
                    <ul class="mb-0">
                        ${correctEmotion.clues.map(clue => `<li>${clue}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    } else {
        const keyDifferences = getKeyDifferences(currentState.selectedEmotion, currentState.currentEmotion);
        
        resultDiv.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <i class="bi bi-x-circle-fill fs-4"></i>
                <strong>Incorrecto</strong> - Seleccionaste ${selectedEmotion.name}, pero era ${correctEmotion.name}
            </div>
            <div class="comparison-images">
                <div class="text-center">
                    <img src="${neutralImg.src}" alt="Neutral" class="border">
                    <small class="d-block text-muted mt-1">Neutral</small>
                </div>
                <div class="text-center">
                    <img src="${expressionImg.src}" alt="Expresión" class="border">
                    <small class="d-block text-muted mt-1">${correctEmotion.name}</small>
                </div>
            </div>
            <div class="feedback-content">
                <div class="key-features">
                    <h6><i class="bi bi-question-circle"></i> ¿Por qué fallaste?</h6>
                    <ul class="mb-0">
                        ${keyDifferences.map(diff => `<li>${diff}</li>`).join('')}
                    </ul>
                </div>
                <div class="key-features mt-3">
                    <h6><i class="bi bi-check-circle text-success"></i> Claves para identificar ${correctEmotion.name}:</h6>
                    <ul class="mb-0">
                        ${correctEmotion.clues.map(clue => `<li>${clue}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Actualizar estadísticas
    updateStats();
    
    // Habilitar botón de inicio
    startBtn.disabled = false;
    checkBtn.disabled = true;
}

/**
 * Actualiza las estadísticas en la UI
 */
function updateStats() {
    scoreSpan.textContent = currentState.score;
    attemptsSpan.textContent = currentState.attempts;
    
    const accuracy = currentState.attempts > 0 
        ? Math.round((currentState.score / currentState.attempts) * 100) 
        : 0;
    accuracySpan.textContent = `${accuracy}%`;
}

/**
 * Reinicia el ensayo actual
 */
function resetTrial() {
    startBtn.disabled = false;
    checkBtn.disabled = true;
    resultDiv.style.display = 'none';
    currentState.selectedEmotion = null;
    
    document.querySelectorAll('.emotion-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Limpiar información del ensayo
    updateTrialInfo({});
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    
    // Precargar una imagen neutral por defecto
    const defaultSubject = 'AF03';
    neutralImg.src = getImagePath(defaultSubject, 'NE', 'F', 'L');
    expressionImg.src = getImagePath(defaultSubject, 'HA', 'F', 'L');
    
    // Actualizar información del ensayo
    currentState.currentSubject = defaultSubject;
    currentState.currentAngle = 'F';
    currentState.currentPosition = 'L';
    updateTrialInfo(currentState);
});