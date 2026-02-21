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
 * Obtiene un sujeto específico según fase y número
 * @param {string} phase - Fase (A o B)
 * @param {string} gender - Género (F o M)
 * @param {string} id - Número de sujeto (01-35)
 * @returns {string} Código completo del sujeto
 */
function getSpecificSubject(phase, gender, id) {
    return `${phase}${gender}${id}`;
}

/**
 * Inicializa la lista de sujetos en el selector manual
 */
function initializeSubjectSelect() {
    const phase = document.getElementById('phaseSelect').value;
    const select = document.getElementById('subjectSelect');
    let options = [];
    
    // Generar opciones para mujeres (F01-F35)
    for (let id of KDEF_CONFIG.subjectIds) {
        options.push(`<option value="${phase}F${id}">${phase}F${id} - Mujer ${id}</option>`);
    }
    
    // Generar opciones para hombres (M01-M35)
    for (let id of KDEF_CONFIG.subjectIds) {
        options.push(`<option value="${phase}M${id}">${phase}M${id} - Hombre ${id}</option>`);
    }
    
    select.innerHTML = options.join('');
}

/**
 * Actualiza la lista de sujetos cuando cambia la fase
 */
function updateSubjectList() {
    initializeSubjectSelect();
}

/**
 * Construye la ruta completa de una imagen KDEF
 * @param {string} subject - Código del sujeto
 * @param {string} emotion - Código de la emoción
 * @param {string} angle - Código del ángulo
 * @returns {string} Ruta completa de la imagen
 * 
 * NOTA: En KDEF, el ángulo ya incluye la posición (L/R)
 * Ejemplo: AF03AFS.JPG (Miedo Frontal)
 *          AF03AFHL.JPG (Miedo Perfil medio izquierdo)
 *          AF03AFHR.JPG (Miedo Perfil medio derecho)
 */
function getImagePath(subject, emotion, angle) {
    // El ángulo ya incluye la posición (S, HL, HR, FL, FR)
    return `https://ik.imagekit.io/xpsde56xg/KDEF/${subject}/${subject}${emotion}${angle}.JPG`;
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
 * Obtiene la descripción completa del nivel de dificultad actual
 * @param {string} difficulty - Nivel de dificultad
 * @returns {string} Descripción completa
 */
function getDifficultyDescription(difficulty) {
    return KDEF_CONFIG.angles[difficulty]?.fullDescription || difficulty;
}

/**
 * Actualiza la información del ensayo actual en la UI con Bootstrap
 * @param {Object} state - Estado actual de la aplicación
 */
function updateTrialInfo(state) {
    const infoDiv = document.getElementById('trialInfo');
    if (!infoDiv) return;
    
    if (state.currentSubject) {
        const gender = state.currentSubject[1] === 'F' ? 'Mujer' : 'Hombre';
        const subjectNum = state.currentSubject.substring(2);
        
        infoDiv.innerHTML = `
            <div class="d-flex justify-content-center">
                <div class="badge-container">
                    <span><i class="bi bi-person"></i> ${state.currentSubject} (${gender} ${subjectNum})</span>
                    <span><i class="bi bi-arrows-angle-expand"></i> ${getAngleDescription(state.currentAngle)}</span>
                </div>
            </div>
            <div class="text-center mt-2">
                <small class="text-muted">
                    <i class="bi bi-info-circle"></i> 
                    Nivel ${state.difficulty === 'easy' ? 'Fácil' : state.difficulty === 'medium' ? 'Medio' : 'Difícil'}: 
                    ${getDifficultyDescription(state.difficulty)}
                </small>
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
    
    const pairs = {
        'HA-SU': {
            selected: 'Alegría',
            correct: 'Sorpresa',
            diffs: [
                'La sorpresa tiene cejas más elevadas que la alegría',
                'En la sorpresa la mandíbula suele caer, en la alegría no'
            ]
        },
        'SU-HA': {
            selected: 'Sorpresa',
            correct: 'Alegría',
            diffs: [
                'La alegría tiene arrugas alrededor de los ojos, la sorpresa no',
                'En la alegría las mejillas se elevan, en la sorpresa no'
            ]
        },
        'AN-DI': {
            selected: 'Ira',
            correct: 'Asco',
            diffs: [
                'La ira tiene cejas fruncidas y hacia abajo, el asco arruga la nariz',
                'En el asco el labio superior se eleva'
            ]
        },
        'DI-AN': {
            selected: 'Asco',
            correct: 'Ira',
            diffs: [
                'La ira tiene mirada penetrante, el asco tiene expresión de rechazo',
                'En la ira los labios se aprietan, en el asco se elevan'
            ]
        },
        'AF-SU': {
            selected: 'Miedo',
            correct: 'Sorpresa',
            diffs: [
                'El miedo tiene cejas rectas y elevadas, la sorpresa las tiene curvas',
                'En el miedo la boca se tensa hacia atrás, en la sorpresa cae'
            ]
        },
        'SU-AF': {
            selected: 'Sorpresa',
            correct: 'Miedo',
            diffs: [
                'El miedo tiene tensión en los labios, la sorpresa tiene relajación',
                'En el miedo los ojos están muy abiertos pero con tensión'
            ]
        },
        'SA-NE': {
            selected: 'Tristeza',
            correct: 'Neutral',
            diffs: [
                'La tristeza tiene comisuras hacia abajo, la neutral tiene línea recta',
                'En la tristeza las cejas tienen forma de triángulo'
            ]
        }
    };
    
    const key = `${selected}-${correct}`;
    if (pairs[key]) {
        return pairs[key].diffs;
    }
    
    return [
        `Presta atención a las cejas: ambas expresiones tienen patrones diferentes`,
        'Observa la boca: la tensión y posición de los labios es clave'
    ];
}

/**
 * Registra en consola la información del ensayo actual
 * @param {Object} state - Estado actual de la aplicación
 */
function logTrialInfo(state) {
    console.group('=== ENSAYO ACTUAL ===');
    console.log('Sujeto:', state.currentSubject);
    console.log('Dificultad:', state.difficulty);
    console.log('Ángulo:', state.currentAngle, `(${getAngleDescription(state.currentAngle)})`);
    console.log('Emoción:', state.currentEmotion, `(${KDEF_CONFIG.emotions[state.currentEmotion]?.name})`);
    console.groupEnd();
}
