// Configuración KDEF con la nomenclatura real
const KDEF_CONFIG = {
    phases: ['A', 'B'],
    genders: ['F', 'M'],
    subjectIds: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
                '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
                '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
                '31', '32', '33', '34', '35'],
    emotions: {
        'AF': {
            name: 'Miedo',
            clues: [
                'Ceja levantada',
                'Ojos muy abiertos',
                'Boca tensa hacia atrás'
            ]
        },
        'AN': {
            name: 'Ira',
            clues: [
                'Ceja baja y fruncida',
                'Mirada penetrante',
                'Labios apretados'
            ]
        },
        'DI': {
            name: 'Asco',
            clues: [
                'Nariz arrugada',
                'Labio superior elevado',
                'Mejillas elevadas'
            ]
        },
        'HA': {
            name: 'Alegría',
            clues: [
                'Comisuras de labios hacia arriba',
                'Arrugas alrededor de ojos',
                'Mejillas elevadas'
            ]
        },
        'SA': {
            name: 'Tristeza',
            clues: [
                'Comisuras de labios hacia abajo',
                'Ceja en forma de triángulo',
                'Párpado superior caído'
            ]
        },
        'SU': {
            name: 'Sorpresa',
            clues: [
                'Ceja muy elevada',
                'Ojos muy abiertos',
                'Mandíbula caída'
            ]
        },
        'NE': {
            name: 'Neutral',
            clues: [
                'Músculos faciales relajados',
                'Sin expresión particular',
                'Línea de boca recta'
            ]
        }
    },
    angles: {
        easy: {
            allowed: ['S'], // Solo frontal (Straight)
            description: 'Solo frontal',
            fullDescription: 'Frontal (S)'
        },
        medium: {
            allowed: ['S', 'HL', 'HR'], // Frontal y perfiles medios
            description: 'Frontal + Perfiles medios',
            fullDescription: 'Frontal (S), Perfil medio izquierdo (HL) y derecho (HR)'
        },
        hard: {
            allowed: ['S', 'HL', 'HR', 'FL', 'FR'], // Todos los ángulos
            description: 'Todos los ángulos',
            fullDescription: 'Frontal (S), Perfil medio (HL/HR) y Perfil completo (FL/FR)'
        }
    },
    
    // Descripciones detalladas de ángulos para mostrar al usuario
    angleDescriptions: {
        'S': 'Frontal',
        'HL': 'Perfil medio izquierdo',
        'HR': 'Perfil medio derecho',
        'FL': 'Perfil completo izquierdo',
        'FR': 'Perfil completo derecho'
    }
};