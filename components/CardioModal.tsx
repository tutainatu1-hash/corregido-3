import React, { useState, useEffect } from 'react';
import { CardioRow } from '../types';

interface CardioModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (data: CardioRow) => void;
    initialData: CardioRow;
}

const CardioModal: React.FC<CardioModalProps> = ({ show, onClose, onSave, initialData }) => {
    const [data, setData] = useState<CardioRow>(initialData);

    useEffect(() => {
        setData(initialData);
    }, [initialData, show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(data);
    };

    const hasAnyMetric = !!(data.time || data.speed || data.incline || data.calories || data.distance);

    if (!show) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-slate-700"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-sky-400 mb-6">Registrar Cardio</h2>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-slate-400 mb-1">Tiempo (min)</label>
                            <input id="time" type="text" value={data.time} onChange={handleChange} name="time" className="bg-slate-900 text-slate-200 w-full focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-md px-3 py-2" />
                        </div>
                        <div>
                            <label htmlFor="speed" className="block text-sm font-medium text-slate-400 mb-1">Velocidad (km/h)</label>
                            <input id="speed" type="text" value={data.speed} onChange={handleChange} name="speed" className="bg-slate-900 text-slate-200 w-full focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-md px-3 py-2" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="incline" className="block text-sm font-medium text-slate-400 mb-1">Inclinación (°)</label>
                            <input id="incline" type="text" value={data.incline} onChange={handleChange} name="incline" className="bg-slate-900 text-slate-200 w-full focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-md px-3 py-2" />
                        </div>
                        <div>
                            <label htmlFor="calories" className="block text-sm font-medium text-slate-400 mb-1">Calorías (kcal)</label>
                            <input id="calories" type="text" value={data.calories} onChange={handleChange} name="calories" className="bg-slate-900 text-slate-200 w-full focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-md px-3 py-2" />
                        </div>
                        <div>
                            <label htmlFor="distance" className="block text-sm font-medium text-slate-400 mb-1">Distancia (km)</label>
                            <input id="distance" type="text" value={data.distance} onChange={handleChange} name="distance" className="bg-slate-900 text-slate-200 w-full focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-md px-3 py-2" />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button 
                        onClick={onClose} 
                        className="bg-slate-600 hover:bg-slate-500 text-slate-200 font-bold py-2 px-5 rounded-md transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={!hasAnyMetric}
                        className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 px-5 rounded-md transition-colors duration-200 disabled:bg-sky-800 disabled:text-slate-400 disabled:cursor-not-allowed"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardioModal;