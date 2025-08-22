export interface Series {
    reps: string;
    kgs: string;
}

export interface StrengthRow {
    date: string;
    series: Series;
    exerciseName: string;
    media?: string[];
}

export interface CardioRow {
    date: string;
    time: string;
    speed: string;
    incline: string;
    calories: string;
    distance: string;
}

export interface Muscle {
    name: string;
    link?: string;
}

export interface WorkoutDayConfig {
    title: string;
    muscles: Muscle[];
}

export interface WorkoutRoutine {
    [key: string]: WorkoutDayConfig;
}

export interface SummaryEntry {
    id: string;
    day: string;
    type: 'cardio' | 'strength';
    exerciseName: string;
    data: CardioRow | StrengthRow;
}

export type SummaryData = SummaryEntry[];

export interface DayData {
    cardioData: CardioRow;
    strengthData: StrengthRow[];
    muscleLinks: { [key: string]: string[] };
}

export interface AllWorkoutData {
    [key: string]: DayData;
}

export interface SavedExercise {
    exerciseName: string;
    media: string[];
    day: string;
}