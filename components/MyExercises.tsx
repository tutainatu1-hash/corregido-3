import React, { useState } from 'react';
import { SavedExercise } from '../types';
import MediaLightbox from './MediaLightbox';
import { WORKOUT_ROUTINE } from '../constants';

interface MyExercisesProps {
    savedExercises: SavedExercise[];
    onDelete: (exerciseName: string) => void;
}

const MyExercises: React.FC<MyExercisesProps> = ({ savedExercises, onDelete }) => {
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    if (savedExercises.length === 0) {
        return (
            <div className="text-center py-10 bg-slate-800 rounded-xl">
                <h2 className="text-3xl font-bold text-sky-400 uppercase tracking-wider mb-4">MIS EJERCICIOS</h2>
                <p className="text-slate-400 text-lg">Aún no has guardado ningún ejercicio.</p>
                <p className="text-slate-500 mt-2">Ve a cualquier día de entrenamiento, añade un nombre y una foto/video a un ejercicio, y presiona el botón de la estrella para guardarlo aquí.</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-sky-400 uppercase tracking-wider">MIS EJERCICIOS</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {savedExercises.map(exercise => {
                        const workoutDayConfig = WORKOUT_ROUTINE[exercise.day as keyof typeof WORKOUT_ROUTINE];
                        const dayTitle = workoutDayConfig ? workoutDayConfig.title : '';

                        return (
                        <div key={exercise.exerciseName} className="bg-slate-800 p-4 rounded-xl shadow-lg relative">
                            <h3 className="text-xl font-semibold text-white mb-1 pr-8">{exercise.exerciseName}</h3>
                             <p className="text-sm text-slate-300 mb-3">
                                {dayTitle && <span className="font-semibold uppercase tracking-wider text-sky-400">{dayTitle}</span>}
                            </p>
                            <button
                                onClick={() => onDelete(exercise.exerciseName)}
                                className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors duration-200 p-1 rounded-full"
                                aria-label={`Eliminar ${exercise.exerciseName} de mis ejercicios`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            <div className="flex flex-wrap gap-2">
                                {exercise.media.map((mediaSrc, index) => {
                                    const isVideo = mediaSrc.startsWith('data:video');
                                    return (
                                        <div key={index} className="cursor-pointer group relative w-28 h-28" onClick={() => setLightboxSrc(mediaSrc)}>
                                            {isVideo ? (
                                                <video src={mediaSrc} className="w-full h-full rounded-md object-cover" muted playsInline />
                                            ) : (
                                                <img src={mediaSrc} alt={`Media de ${exercise.exerciseName} ${index + 1}`} className="w-full h-full rounded-md object-cover" />
                                            )}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {lightboxSrc && <MediaLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
        </>
    );
};

export default MyExercises;