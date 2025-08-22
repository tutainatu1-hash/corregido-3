import React, { useRef, useState } from 'react';
import { StrengthRow } from '../types';
import MediaLightbox from './MediaLightbox';

interface StrengthTableProps {
    data: StrengthRow;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onMediaAdd: (mediaBase64: string) => void;
    onMediaDelete: (mediaIndex: number) => void;
    onSave: () => void;
    onSaveToMyExercises: () => void;
    onClear: () => void;
    onDelete: () => void;
}

const StrengthTable: React.FC<StrengthTableProps> = ({ 
    data, 
    onInputChange,
    onMediaAdd,
    onMediaDelete,
    onSave, 
    onSaveToMyExercises,
    onClear, 
    onDelete, 
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onMediaAdd(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const triggerFileSelect = () => fileInputRef.current?.click();
    const canSaveToMyExercises = data.exerciseName.trim() !== '' && data.media && data.media.length > 0;

    return (
        <>
            <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg">
                <div className="mb-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            name="exerciseName"
                            value={data.exerciseName}
                            onChange={onInputChange}
                            placeholder="Nombre del Ejercicio"
                            className="flex-grow bg-slate-900/50 text-white text-2xl font-semibold w-full focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-md px-3 py-2 placeholder-slate-500"
                        />
                         <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*,video/*"
                            capture="environment"
                            className="hidden"
                        />
                        <button
                            onClick={triggerFileSelect}
                            className="flex-shrink-0 bg-slate-600 hover:bg-slate-500 text-slate-200 p-3 rounded-md transition-colors duration-200"
                            aria-label="Añadir imagen o video"
                            title="Añadir imagen o video"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button
                            onClick={onSaveToMyExercises}
                            disabled={!canSaveToMyExercises}
                            className="flex-shrink-0 bg-amber-500 hover:bg-amber-400 text-white p-3 rounded-md transition-colors duration-200 disabled:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Guardar en Mis Ejercicios"
                            title="Guardar en Mis Ejercicios"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </button>
                        <button
                            onClick={onDelete}
                            className="flex-shrink-0 bg-rose-600 hover:bg-rose-500 text-white p-3 rounded-md transition-colors duration-200"
                            aria-label="Borrar ejercicio"
                            title="Borrar ejercicio"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                    {data.media && data.media.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-3">
                            {data.media.map((mediaSrc, index) => {
                                const isVideo = mediaSrc.startsWith('data:video');
                                return (
                                <div key={index} className="relative w-32 h-32 cursor-pointer group" onClick={() => setLightboxSrc(mediaSrc)}>
                                    {isVideo ? (
                                        <video src={mediaSrc} className="rounded-md w-full h-full object-cover" muted playsInline />
                                    ) : (
                                        <img src={mediaSrc} alt={`Vista previa del ejercicio ${index + 1}`} className="rounded-md w-full h-full object-cover" />
                                    )}
                                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onMediaDelete(index);
                                        }}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-opacity duration-200"
                                        aria-label={`Eliminar media ${index + 1}`}
                                    >
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )})}
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                            <tr>
                                <th className="px-4 py-3 w-1/2">Fecha</th>
                                <th className="px-4 py-3 text-center border-l border-slate-700 w-1/4">Serie</th>
                                <th className="px-4 py-3 text-center border-l border-slate-700 w-1/4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-700">
                                <td className="px-4 py-2"><input type="text" name="date" value={data.date} onChange={onInputChange} className="bg-slate-800 text-slate-200 w-full focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-md px-2 py-1" /></td>
                                <td className="px-2 py-2 border-l border-slate-700">
                                    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                        <input type="text" name="reps" value={data.series.reps} onChange={onInputChange} placeholder="Reps" className="bg-slate-900 text-slate-200 w-14 sm:w-16 text-center focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-md p-1" />
                                        <input type="text" name="kgs" value={data.series.kgs} onChange={onInputChange} placeholder="KGs" className="bg-slate-900 text-slate-200 w-14 sm:w-16 text-center focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-md p-1" />
                                    </div>
                                </td>
                                <td className="px-4 py-2 border-l border-slate-700">
                                    <div className="flex justify-center items-center space-x-2">
                                        <button onClick={onSave} className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-1 px-3 rounded-md transition-colors duration-200">Guardar</button>
                                        <button onClick={onClear} className="bg-slate-600 hover:bg-slate-500 text-slate-200 font-bold py-1 px-3 rounded-md transition-colors duration-200">Borrar</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {lightboxSrc && <MediaLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
        </>
    );
};

export default StrengthTable;