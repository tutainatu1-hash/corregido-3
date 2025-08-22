import React from 'react';
import { WORKOUT_ROUTINE } from '../constants';

const Exercises: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="text-center">
                 <h2 className="text-3xl font-bold text-sky-400 uppercase tracking-wider">Plan de Ejercicios</h2>
                 <p className="text-slate-400 mt-2">Guía de músculos y rutinas para cada día de entrenamiento.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(WORKOUT_ROUTINE).map(([day, config]) => (
                    <div key={day} className="bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col">
                        <h3 className="text-2xl font-bold text-sky-400 mb-4 border-b border-slate-700 pb-3">{day}: <span className="text-white">{config.title}</span></h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
                            {config.muscles.map(muscle => (
                                <div key={muscle.name} className="bg-slate-900/50 p-4 rounded-lg flex flex-col justify-between items-center text-center">
                                    <h4 className="text-lg font-semibold text-slate-200 mb-3">{muscle.name}</h4>
                                    <a
                                        href={muscle.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-full bg-sky-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 text-sm ${!muscle.link ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sky-400'}`}
                                        onClick={(e) => !muscle.link && e.preventDefault()}
                                        aria-disabled={!muscle.link}
                                    >
                                        Ver Rutina
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Exercises;