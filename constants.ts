import { WorkoutRoutine } from './types';

export const TABS: string[] = ['MIS EJERCICIOS', 'DIA 1', 'DIA 2', 'DIA 3', 'DIA 4', 'RESUMEN'];

export const WORKOUT_ROUTINE: WorkoutRoutine = {
    'DIA 1': {
        title: 'Pecho y Bíceps',
        muscles: [
            { name: 'Pecho' },
            { name: 'Bíceps' }
        ]
    },
    'DIA 2': {
        title: 'Pierna y Glúteo',
        muscles: [
            { name: 'Pierna' },
            { name: 'Glúteo' }
        ]
    },
    'DIA 3': {
        title: 'Hombro y Espalda',
        muscles: [
            { name: 'Hombro' },
            { name: 'Espalda' }
        ]
    },
    'DIA 4': {
        title: 'Tríceps y Antebrazo',
        muscles: [
            { name: 'Tríceps' },
            { name: 'Antebrazo' }
        ]
    },
};