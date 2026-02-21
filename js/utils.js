// Utilidades para la aplicación

/**
 * Obtiene un sujeto aleatorio de la base de datos KDEF
 * @returns {string} Código del sujeto (ej: AF03, BM15, etc.)
 */
function getRandomSubject() {
    const phase = KDEF_CONFIG.phases[Math.floor(Math.random() * KDEF_CONFIG.phases.length)];
    const gender = KDEF_CONFIG.genders[Math.floor(Math.random() * KDEF_CONFIG.genders.length)];
    const id = KDEF_CONFIG.subjectIds[Math.floor(Math.random() * KDEF_CONFIG.subjectIds.length)];
    return `${phase}${gender}${id}`;
}

/**
 * Construye la ruta completa de una imagen KDEF
 * @param {string} subject - Código del sujeto
 * @param {string} emotion - Código de la emoción
 * @param {string} angle - Código del ángulo
 * @param {string} position - Código de la posición (L/R)
 * @returns {string} Ruta completa de la imagen
 */
function getImagePath(subject, emotion, angle, position) {
    // Estructura: KDEF/<sujeto>/<sujeto><emoción><ángulo><posición>.JPG
    return `KDEF/${subject}/${subject}${emotion}${angle}${position}.JPG`;
}

/**
 * Obtiene la posición opuesta (L -> R, R -> L)
 * @param {string} position - Posición actual
 * @returns {string} Posición opuesta
 */
function getOppositePosition(position) {
    return position === 'L' ? 'R' : 'L';
}

/**
 * Obtiene la descripción del ángulo para mostrar al usuario
 * @param {string} angle - Código del ángulo
 * @returns {string} Descripción del ángulo
 */
function getAngleDescription(angle) {
    return KDEF_CONFIG.angleDescriptions[angle] || angle;
}

/**
 * Actualiza la información del ensayo actual en la UI
 * @param {Object} state - Estado actual de la aplicación
 */
function updateTrialInfo(state) {
    const infoDiv = document.getElementById('trialInfo');
    if (!infoDiv) return;
    
    if (state.currentSubject) {
        infoDiv.innerHTML = `
            <div class="info-badge">
                <span>👤 Sujeto: ${state.currentSubject}</span>
                <span>📐 Ángulo: ${getAngleDescription(state.currentAngle)}</span>
                <span>📏 Posición: ${state.currentPosition || '---'}</span>
            </div>
        `;
    } else {
        infoDiv.innerHTML = '';
    }
}

/**
 * Obtiene las diferencias clave entre dos emociones
 * @param {string} selected - Código de la emoción seleccionada
 * @param {string} correct - Código de la emoción correcta
 * @returns {Array} Lista de diferencias
 */
function getKeyDifferences(selected, correct) {
    const differences = [];
    
    // Comparar características clave entre emociones
    if (selected === 'HA' && correct === 'SU') {
        differences.push('La sorpresa tiene cejas más elevadas que la alegría');
        differences.push('En la sorpresa la mandíbula suele caer, en la alegría no');
    } else if (selected === 'SU' && correct === 'HA') {
        differences.push('La alegría tiene arrugas alrededor de los ojos, la sorpresa no');
        differences.push('En la alegría las mejillas se elevan, en la sorpresa no');
    } else if (selected === 'AN' && correct === 'DI') {
        differences.push('La ira tiene cejas fruncidas y hacia abajo, el asco arruga la nariz');
        differences.push('En el asco el labio superior se eleva');
    } else if (selected === 'DI' && correct === 'AN') {
        differences.push('La ira tiene mirada penetrante, el asco tiene expresión de rechazo');
        differences.push('En la ira los labios se aprietan, en el asco se elevan');
    } else if (selected === 'AF' && correct === 'SU') {
        differences.push('El miedo tiene cejas rectas y elevadas, la sorpresa las tiene curvas');
        differences.push('En el miedo la boca se tensa hacia atrás, en la sorpresa cae');
    } else if (selected === 'SU' && correct === 'AF') {
        differences.push('El miedo tiene tensión en los labios, la sorpresa tiene relajación');
        differences.push('En el miedo los ojos están muy abiertos pero con tensión');
    } else if (selected === 'SA' && correct === 'NE') {
        differences.push('La tristeza tiene comisuras hacia abajo, la neutral tiene línea recta');
        differences.push('En la tristeza las cejas tienen forma de triángulo');
    }
    
    if (differences.length === 0) {
        differences.push(`Presta atención a las cejas: ${selected} y ${correct} tienen patrones diferentes`);
        differences.push('Observa la boca: la tensión y posición de los labios es clave');
    }
    
    return differences;
}

/**
 * Registra en consola la información del ensayo actual (para depuración)
 * @param {Object} state - Estado actual de la aplicación
 */
function logTrialInfo(state) {
    console.log('=== ENSAYO ACTUAL ===');
    console.log('Sujeto:', state.currentSubject);
    console.log('Ángulo:', state.currentAngle);
    console.log('Posición:', state.currentPosition);
    console.log('Emoción:', state.currentEmotion);
    console.log('===================');
}