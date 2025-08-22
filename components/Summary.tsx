import React, { useState } from 'react';
import { SummaryData, SummaryEntry, CardioRow, StrengthRow } from '../types';
import { TABS } from '../constants';
import MediaLightbox from './MediaLightbox';

interface SummaryProps {
    data: SummaryData;
    onDelete: (id: string) => void;
    onDeleteAll: () => void;
}

const Summary: React.FC<SummaryProps> = ({ data, onDelete, onDeleteAll }) => {
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    if (data.length === 0) {
        return (
            <div className="text-center py-10 bg-slate-800 rounded-xl">
                <div className="flex justify-center items-center gap-4 mb-4">
                    <h2 className="text-3xl font-bold text-sky-400 uppercase tracking-wider">RESUMEN</h2>
                    <button
                       onClick={onDeleteAll}
                       className="bg-slate-600 hover:bg-slate-500 text-slate-200 font-bold py-2 px-4 rounded-md transition-colors duration-200 text-sm">
                       Borrar Todo
                   </button>
                </div>
                <p className="text-slate-400 text-lg">Aún no hay datos guardados.</p>
                <p className="text-slate-500 mt-2">Completa una fila en cualquier día de entrenamiento y presiona "Guardar".</p>
            </div>
        );
    }
    
    const relevantDays = TABS.filter(day => !['RESUMEN', 'MIS EJERCICIOS'].includes(day));
    
    const groupedData = data.reduce((acc, entry) => {
        acc[entry.day] = acc[entry.day] || {};
        (acc[entry.day][entry.exerciseName] = acc[entry.day][entry.exerciseName] || []).push(entry);
        return acc;
    }, {} as { [day: string]: { [exerciseName: string]: SummaryEntry[] } });


    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-center items-center gap-4 text-center mb-8">
                    <h2 className="text-3xl font-bold text-sky-400 uppercase tracking-wider">RESUMEN</h2>
                    <button
                       onClick={onDeleteAll}
                       className="bg-slate-600 hover:bg-slate-500 text-slate-200 font-bold py-2 px-4 rounded-md transition-colors duration-200 text-sm">
                       Borrar Todo
                    </button>
               </div>
                {relevantDays.map(day => {
                    const exercisesForDay = groupedData[day];
                    if (!exercisesForDay || Object.keys(exercisesForDay).length === 0) return null;

                    return (
                        <div key={day} className="bg-slate-800 p-6 rounded-xl shadow-lg">
                            <h2 className="text-3xl font-bold text-sky-400 mb-6 border-b border-slate-700 pb-3">{day}</h2>
                            <div className="space-y-8">
                                {Object.keys(exercisesForDay).sort().map(exerciseName => {
                                    const entries = exercisesForDay[exerciseName];
                                    entries.sort((a, b) => a.id.localeCompare(b.id));

                                    return (
                                    <div key={exerciseName} className="bg-slate-900/50 p-4 rounded-lg">
                                        <h3 className="text-xl font-semibold text-white mb-3">{exerciseName}</h3>
                                        <div className="space-y-4">
                                            {entries.map(entry => {
                                                const cardioData = entry.data as CardioRow;
                                                const strengthData = entry.data as StrengthRow;
                                                return (
                                                <div key={entry.id} className="flex justify-between items-start border-t border-slate-700/50 pt-3 first:border-t-0 first:pt-0">
                                                    <div className="flex-grow">
                                                        <div>
                                                            <p className="text-sm font-normal text-slate-400 mb-2">
                                                                <span className="font-semibold">Fecha:</span> {strengthData.date || 'N/A'}
                                                            </p>
                                                            {entry.type === 'cardio' ? (
                                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                                                                    <p><span className="text-slate-400">Tiempo:</span> {cardioData.time || '0'} min</p>
                                                                    <p><span className="text-slate-400">Velocidad:</span> {cardioData.speed || '0'} km/h</p>
                                                                    <p><span className="text-slate-400">Inclinación:</span> {cardioData.incline || '0'} °</p>
                                                                    <p><span className="text-slate-400">Calorías:</span> {cardioData.calories || '0'} kcal</p>
                                                                    <p><span className="text-slate-400">Distancia:</span> {cardioData.distance || '0'} km</p>
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm">
                                                                    {(strengthData.series.reps || strengthData.series.kgs) ? (
                                                                        <p className="whitespace-nowrap">
                                                                            <span className="text-slate-400">Serie:</span> {strengthData.series.reps || '0'} reps x {strengthData.series.kgs || '0'} kg
                                                                        </p>
                                                                    ) : null}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {entry.type === 'strength' && strengthData.media && strengthData.media.length > 0 && (
                                                            <div className="mt-3 flex flex-wrap gap-2">
                                                                {strengthData.media.map((mediaSrc, index) => {
                                                                    const isVideo = mediaSrc.startsWith('data:video');
                                                                    return (
                                                                        <div key={index} className="cursor-pointer group relative" onClick={() => setLightboxSrc(mediaSrc)}>
                                                                            {isVideo ? (
                                                                                <video src={mediaSrc} className="w-24 h-24 rounded-md object-cover" muted playsInline />
                                                                            ) : (
                                                                                <img src={mediaSrc} alt={`Media de ${entry.exerciseName} ${index + 1}`} className="w-24 h-24 rounded-md object-cover" />
                                                                            )}
                                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button 
                                                        onClick={() => onDelete(entry.id)}
                                                        className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-1 px-3 rounded-md transition-colors duration-200 text-xs ml-4 flex-shrink-0"
                                                        aria-label={`Borrar entrada de ${entry.exerciseName} de la fecha ${strengthData.date}`}
                                                        >
                                                        Borrar
                                                    </button>
                                                </div>
                                            )})}
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            {lightboxSrc && <MediaLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
        </>
    );
};

export default Summary;