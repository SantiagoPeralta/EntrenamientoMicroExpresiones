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
            allowed: ['F'], // Solo frontal
            description: 'Frontal',
            fullDescription: 'Ángulo Frontal'
        },
        medium: {
            allowed: ['F', 'H'], // Frontal y perfil
            description: 'Frontal + Perfil',
            fullDescription: 'Frontal (F) o Perfil 45° (H)'
        },
        hard: {
            allowed: ['F', 'H', 'S'], // Frontal, perfil y perfil completo
            description: 'Todos los ángulos',
            fullDescription: 'Frontal (F), Perfil 45° (H) o Perfil 90° (S)'
        }
    },
    positions: ['L', 'R'],
    
    // Descripciones detalladas de ángulos para mostrar al usuario
    angleDescriptions: {
        'F': 'Frontal',
        'H': 'Perfil 45°',
        'S': 'Perfil 90°'
    }
};