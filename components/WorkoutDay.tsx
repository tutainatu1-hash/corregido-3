import React, { useState } from 'react';
import { WorkoutDayConfig, CardioRow, StrengthRow, DayData, SavedExercise } from '../types';
import CardioTable from './CardioTable';
import StrengthTable from './StrengthTable';
import CardioModal from './CardioModal';

const createInitialCardioState = (): CardioRow => ({
    date: '',
    time: '',
    speed: '',
    incline: '',
    calories: '',
    distance: ''
});

const createInitialStrengthRow = (exerciseName: string = '', date: string = ''): StrengthRow => ({
    date,
    series: { reps: '', kgs: '' },
    exerciseName,
    media: [],
});

interface WorkoutDayProps {
    day: string;
    config: WorkoutDayConfig;
    dayData: DayData;
    postureLinks: string[];
    onDataChange: (day: string, newDayData: DayData) => void;
    onPostureLinksChange: (newLinks: string[]) => void;
    onSave: (day: string, type: 'cardio' | 'strength', exerciseName: string, data: CardioRow | StrengthRow) => void;
    onSaveAll: (day: string, dayData: DayData) => void;
    onSaveExercise: (exercise: SavedExercise) => void;
}

const WorkoutDay: React.FC<WorkoutDayProps> = ({ day, config, dayData, postureLinks, onDataChange, onPostureLinksChange, onSave, onSaveAll, onSaveExercise }) => {
    const [isCardioModalOpen, setCardioModalOpen] = useState(false);

    const hasSomeCardioData = !!(dayData.cardioData.time || dayData.cardioData.speed || dayData.cardioData.incline || dayData.cardioData.calories || dayData.cardioData.distance);
    const [isCardioVisible, setIsCardioVisible] = useState<boolean>(!hasSomeCardioData);
    
    const [currentLinks, setCurrentLinks] = useState<{ [key: string]: string }>({});
    const [currentPostureLink, setCurrentPostureLink] = useState<string>('');

    const [lastUsedDate, setLastUsedDate] = useState<string>(() => {
        const strengthDate = dayData.strengthData?.[0]?.date;
        const cardioDate = dayData.cardioData?.date;
        return strengthDate || cardioDate || '';
    });

    const handleCardioDataChange = (updatedCardioData: CardioRow) => {
        if (updatedCardioData.date) {
            setLastUsedDate(updatedCardioData.date);
        }
        onDataChange(day, { ...dayData, cardioData: updatedCardioData });
    };

    const handleSaveCardioFromModal = (newCardioData: CardioRow) => {
        const updatedData = { ...dayData.cardioData, ...newCardioData };
        onDataChange(day, { ...dayData, cardioData: updatedData });
        setCardioModalOpen(false);
    };

    const handleClearCardio = () => {
        onDataChange(day, { ...dayData, cardioData: createInitialCardioState() });
        setIsCardioVisible(true);
    };

    const handleSaveCardio = () => {
        onSave(day, 'cardio', 'Cardio', dayData.cardioData);
        const hasDataToSave = !!(dayData.cardioData.time || dayData.cardioData.speed || dayData.cardioData.incline || dayData.cardioData.calories || dayData.cardioData.distance);
        if (hasDataToSave) {
            setIsCardioVisible(false);
        }
    };

    const handleStrengthInputChange = (e: React.ChangeEvent<HTMLInputElement>, exerciseIndex: number) => {
        const { name, value } = e.target;
        
        if (name === 'date' && value) {
            setLastUsedDate(value);
        }
        
        const updatedStrengthData = JSON.parse(JSON.stringify(dayData.strengthData));
        const currentExercise = updatedStrengthData[exerciseIndex];
        
        if (name === 'date') {
            currentExercise.date = value;
        } else if (name === 'exerciseName') {
            currentExercise.exerciseName = value;
        } else {
            currentExercise.series[name as 'reps' | 'kgs'] = value;
        }
        onDataChange(day, { ...dayData, strengthData: updatedStrengthData });
    };

    const handleStrengthMediaAdd = (mediaBase64: string, exerciseIndex: number) => {
        const updatedStrengthData = JSON.parse(JSON.stringify(dayData.strengthData));
        if (!updatedStrengthData[exerciseIndex].media) {
            updatedStrengthData[exerciseIndex].media = [];
        }
        updatedStrengthData[exerciseIndex].media.push(mediaBase64);
        onDataChange(day, { ...dayData, strengthData: updatedStrengthData });
    };

    const handleStrengthMediaDelete = (exerciseIndex: number, mediaIndex: number) => {
        const updatedStrengthData = JSON.parse(JSON.stringify(dayData.strengthData));
        updatedStrengthData[exerciseIndex].media?.splice(mediaIndex, 1);
        onDataChange(day, { ...dayData, strengthData: updatedStrengthData });
    };

    const handleClearStrength = (exerciseIndex: number) => {
        const updatedStrengthData = [...dayData.strengthData];
        const { exerciseName, date } = updatedStrengthData[exerciseIndex];
        updatedStrengthData[exerciseIndex] = createInitialStrengthRow(exerciseName, date);
        onDataChange(day, { ...dayData, strengthData: updatedStrengthData });
    };

    const handleSaveStrength = (exerciseIndex: number) => {
        const exerciseData = dayData.strengthData[exerciseIndex];
        onSave(day, 'strength', exerciseData.exerciseName, exerciseData);
    };

    const handleSaveToMyExercises = (exerciseIndex: number) => {
        const { exerciseName, media } = dayData.strengthData[exerciseIndex];
        if (exerciseName && media && media.length > 0) {
            onSaveExercise({ exerciseName, media, day });
        }
    };
    
    const handleAddStrengthExercise = () => {
        const newStrengthData = [...dayData.strengthData, createInitialStrengthRow('', lastUsedDate)];
        onDataChange(day, { ...dayData, strengthData: newStrengthData });
    };

    const handleDeleteStrength = (exerciseIndex: number) => {
        if (dayData.strengthData.length > 1) {
            const newStrengthData = dayData.strengthData.filter((_, index) => index !== exerciseIndex);
            onDataChange(day, { ...dayData, strengthData: newStrengthData });
        }
    };

    const handleCurrentLinkChange = (muscleName: string, value: string) => {
        setCurrentLinks(prev => ({ ...prev, [muscleName]: value }));
    };

    const handleAddMuscleLink = (muscleName: string) => {
        const linkToAdd = currentLinks[muscleName]?.trim();
        if (linkToAdd) {
            const newMuscleLinks = {
                ...dayData.muscleLinks,
                [muscleName]: [...(dayData.muscleLinks[muscleName] || []), linkToAdd]
            };
            onDataChange(day, { ...dayData, muscleLinks: newMuscleLinks });
            setCurrentLinks(prev => ({ ...prev, [muscleName]: '' }));
        }
    };

    const handleDeleteMuscleLink = (muscleName: string, linkIndex: number) => {
        const updatedLinksForMuscle = (dayData.muscleLinks[muscleName] || []).filter((_, index) => index !== linkIndex);
        const newMuscleLinks = {
            ...dayData.muscleLinks,
            [muscleName]: updatedLinksForMuscle
        };
        onDataChange(day, { ...dayData, muscleLinks: newMuscleLinks });
    };

    const handleAddPostureLink = () => {
        const linkToAdd = currentPostureLink.trim();
        if (linkToAdd) {
            const newPostureLinks = [...postureLinks, linkToAdd];
            onPostureLinksChange(newPostureLinks);
            setCurrentPostureLink('');
        }
    };

    const handleDeletePostureLink = (linkIndex: number) => {
        const updatedLinks = postureLinks.filter((_, index) => index !== linkIndex);
        onPostureLinksChange(updatedLinks);
    };

    const handleSaveAll = () => {
        onSaveAll(day, dayData);
    };

    const handleClearAll = () => {
        const clearedDayData: DayData = {
            cardioData: createInitialCardioState(),
            strengthData: [createInitialStrengthRow()],
            muscleLinks: dayData.muscleLinks,
        };
        onDataChange(day, clearedDayData);
        setIsCardioVisible(true);
    };

    return (
        <>
            <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg max-w-xl mx-auto mb-8">
                <h2 className="text-3xl font-bold text-sky-400 tracking-wide uppercase text-center mb-4">POSTURA</h2>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={currentPostureLink}
                        onChange={(e) => setCurrentPostureLink(e.target.value)}
                        placeholder="Pega el enlace aquí"
                        className="bg-slate-900/50 text-slate-200 w-full focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-md px-3 py-2 text-sm placeholder-slate-500 flex-grow"
                        aria-label="Añadir enlace para Postura"
                    />
                    <button
                        onClick={handleAddPostureLink}
                        disabled={!currentPostureLink.trim()}
                        className="flex-shrink-0 bg-sky-500 text-white font-bold w-9 h-9 rounded-md flex items-center justify-center transition-colors duration-200 disabled:bg-sky-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-400"
                        aria-label="Añadir enlace para Postura"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
                {postureLinks.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-32 overflow-y-auto pr-1">
                        {postureLinks.map((link, index) => {
                            const safeLink = link && !link.startsWith('http') ? `https://${link}` : link;
                            return (
                                <div key={index} className="flex items-center justify-between gap-2">
                                    <a
                                        href={safeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full text-center bg-sky-600 hover:bg-sky-500 text-white font-semibold py-1.5 px-3 rounded-md transition-colors duration-200 text-sm flex-grow"
                                        title={link}
                                    >
                                        Video {index + 1}
                                    </a>
                                    <button
                                        onClick={() => handleDeletePostureLink(index)}
                                        className="text-slate-500 hover:text-red-400 transition-colors duration-200 p-1 rounded-full flex-shrink-0"
                                        aria-label={`Borrar enlace ${link}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="space-y-8">
                <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg max-w-xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                        <h2 className="text-3xl font-bold text-sky-400 tracking-wide uppercase">{config.title}</h2>
                        <div className="flex gap-2">
                             <button onClick={handleSaveAll} className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 text-sm">Guardar Todo</button>
                             <button onClick={handleClearAll} className="bg-slate-600 hover:bg-slate-500 text-slate-200 font-bold py-2 px-4 rounded-md transition-colors duration-200 text-sm">Borrar Todo</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                        {config.muscles.map(muscle => {
                            const currentLink = currentLinks[muscle.name] || '';
                            const savedLinks = dayData.muscleLinks?.[muscle.name] || [];
                            return (
                                <div key={muscle.name} className="bg-slate-900/50 p-4 rounded-lg flex flex-col justify-start">
                                    <h4 className="text-lg font-semibold text-slate-200 mb-3 w-full text-center">{muscle.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={currentLink}
                                            onChange={(e) => handleCurrentLinkChange(muscle.name, e.target.value)}
                                            placeholder="Pega el enlace aquí"
                                            className="bg-slate-800 text-slate-200 w-full focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-md px-3 py-2 text-sm placeholder-slate-500 flex-grow"
                                            aria-label={`Añadir enlace para ${muscle.name}`}
                                        />
                                        <button
                                            onClick={() => handleAddMuscleLink(muscle.name)}
                                            disabled={!currentLink.trim()}
                                            className="flex-shrink-0 bg-sky-500 text-white font-bold w-9 h-9 rounded-md flex items-center justify-center transition-colors duration-200 disabled:bg-sky-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-400"
                                            aria-label={`Añadir enlace para ${muscle.name}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>
                                    {savedLinks.length > 0 && (
                                        <div className="mt-4 space-y-2 max-h-32 overflow-y-auto pr-1">
                                            {savedLinks.map((link, index) => {
                                                const safeLink = link && !link.startsWith('http') ? `https://${link}` : link;
                                                return (
                                                    <div key={index} className="flex items-center justify-between gap-2">
                                                        <a 
                                                            href={safeLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block w-full text-center bg-sky-600 hover:bg-sky-500 text-white font-semibold py-1.5 px-3 rounded-md transition-colors duration-200 text-sm flex-grow"
                                                            title={link}
                                                        >
                                                            Video {index + 1}
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeleteMuscleLink(muscle.name, index)}
                                                            className="text-slate-500 hover:text-red-400 transition-colors duration-200 p-1 rounded-full flex-shrink-0"
                                                            aria-label={`Borrar enlace ${link}`}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="space-y-10">
                    {dayData.strengthData.map((exercise, exerciseIndex) => (
                        <StrengthTable 
                            key={exerciseIndex}
                            data={exercise}
                            onInputChange={(e) => handleStrengthInputChange(e, exerciseIndex)}
                            onMediaAdd={(mediaBase64) => handleStrengthMediaAdd(mediaBase64, exerciseIndex)}
                            onMediaDelete={(mediaIndex) => handleStrengthMediaDelete(exerciseIndex, mediaIndex)}
                            onSave={() => handleSaveStrength(exerciseIndex)}
                            onSaveToMyExercises={() => handleSaveToMyExercises(exerciseIndex)}
                            onClear={() => handleClearStrength(exerciseIndex)}
                            onDelete={() => handleDeleteStrength(exerciseIndex)}
                        />
                    ))}
                </div>
                
                <div className="flex justify-center pt-4">
                    <button
                        onClick={handleAddStrengthExercise}
                        className="flex items-center justify-center w-14 h-14 bg-sky-500 hover:bg-sky-400 rounded-full text-white transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-400 transform hover:scale-110"
                        aria-label="Añadir nuevo ejercicio"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
                
                <CardioTable 
                    data={dayData.cardioData} 
                    onDataChange={handleCardioDataChange}
                    onEdit={() => setCardioModalOpen(true)}
                    onSave={handleSaveCardio} 
                    onClear={handleClearCardio} 
                    isVisible={isCardioVisible}
                    onShow={() => setIsCardioVisible(true)}
                />

            </div>

            <CardioModal
                show={isCardioModalOpen}
                onClose={() => setCardioModalOpen(false)}
                onSave={handleSaveCardioFromModal}
                initialData={dayData.cardioData}
            />
        </>
    );
};

export default WorkoutDay;