import React from 'react';
import { CardioRow } from '../types';

interface CardioTableProps {
    data: CardioRow;
    onDataChange: (data: CardioRow) => void;
    onEdit: () => void;
    onSave: () => void;
    onClear: () => void;
    isVisible: boolean;
    onShow: () => void;
}

const CardioTable: React.FC<CardioTableProps> = ({ data, onDataChange, onEdit, onSave, onClear, isVisible, onShow }) => {
    const hasAnyMetric = !!(data.time || data.speed || data.incline || data.calories || data.distance);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onDataChange({ ...data, date: e.target.value });
    };

    return (
        <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg">
            <div className={`flex justify-center items-center gap-4 ${isVisible ? 'mb-4' : ''}`}>
                <h2 className="text-3xl font-bold text-sky-400 tracking-wide uppercase">Cardio</h2>
                {!isVisible && (
                    <button
                        onClick={onShow}
                        className="flex-shrink-0 bg-sky-500 text-white font-bold w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-sky-400"
                        aria-label="Añadir o editar datos de cardio"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                )}
            </div>

            {isVisible && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                            <tr>
                                <th className="px-4 py-3 w-[25%]">Fecha</th>
                                <th className="px-4 py-3 w-[50%]">Métricas</th>
                                <th className="px-4 py-3 text-center w-[25%]">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-700">
                                <td className="px-4 py-2 align-top">
                                    <input 
                                        type="text" 
                                        value={data.date} 
                                        onChange={handleDateChange} 
                                        name="date" 
                                        className="bg-slate-900 text-slate-200 w-full focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-md px-2 py-1 mt-1" />
                                </td>
                                <td className="px-4 py-2 align-top">
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex-grow">
                                        {hasAnyMetric ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm cursor-pointer" onClick={onEdit}>
                                                {data.time && <p>
                                                    <span className="text-slate-400">Tiempo: </span>
                                                    <span className="font-semibold text-slate-100">{data.time}</span>
                                                    <span className="text-slate-400"> min</span>
                                                </p>}
                                                {data.speed && <p>
                                                    <span className="text-slate-400">Velocidad: </span>
                                                    <span className="font-semibold text-slate-100">{data.speed}</span>
                                                    <span className="text-slate-400"> km/h</span>
                                                </p>}
                                                {data.incline && <p>
                                                    <span className="text-slate-400">Inclinación: </span>
                                                    <span className="font-semibold text-slate-100">{data.incline}</span>
                                                    <span className="text-slate-400"> °</span>
                                                </p>}
                                                {data.calories && <p>
                                                    <span className="text-slate-400">Calorías: </span>
                                                    <span className="font-semibold text-slate-100">{data.calories}</span>
                                                    <span className="text-slate-400"> kcal</span>
                                                </p>}
                                                {data.distance && <p>
                                                    <span className="text-slate-400">Distancia: </span>
                                                    <span className="font-semibold text-slate-100">{data.distance}</span>
                                                    <span className="text-slate-400"> km</span>
                                                </p>}
                                            </div>
                                        ) : (
                                            <div className="text-slate-400 italic cursor-pointer" onClick={onEdit}>
                                                Haz clic para añadir métricas...
                                            </div>
                                        )}
                                        </div>
                                        <button onClick={onEdit} className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-1 px-3 rounded-md transition-colors duration-200 text-xs">
                                            Editar
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-2 align-top">
                                    <div className="flex justify-center items-center space-x-2 mt-1">
                                        <button 
                                            onClick={onSave} 
                                            disabled={!hasAnyMetric}
                                            className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-1 px-3 rounded-md transition-colors duration-200 disabled:bg-sky-800 disabled:text-slate-400 disabled:cursor-not-allowed"
                                        >
                                            Guardar
                                        </button>
                                        <button onClick={onClear} className="bg-slate-600 hover:bg-slate-500 text-slate-200 font-bold py-1 px-3 rounded-md transition-colors duration-200">Borrar</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CardioTable;