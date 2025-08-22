import React, { useState, useCallback, useEffect } from 'react';
import { TABS, WORKOUT_ROUTINE } from './constants';
import { SummaryData, WorkoutDayConfig, CardioRow, StrengthRow, AllWorkoutData, DayData, SummaryEntry, SavedExercise } from './types';
import WorkoutDay from './components/WorkoutDay';
import Summary from './components/Summary';
import MyExercises from './components/MyExercises';
import Notification from './components/Notification';

const createInitialCardioState = (): CardioRow => ({
    date: '',
    time: '',
    speed: '',
    incline: '',
    calories: '',
    distance: ''
});

const createInitialStrengthRow = (): StrengthRow => ({
    exerciseName: '',
    date: '',
    series: { reps: '', kgs: '' },
    media: [],
});

const createInitialAllWorkoutData = (): AllWorkoutData => {
  const data: AllWorkoutData = {};
  Object.keys(WORKOUT_ROUTINE).forEach(day => {
    const muscleLinks: { [key: string]: string[] } = {};
    WORKOUT_ROUTINE[day].muscles.forEach(muscle => {
        muscleLinks[muscle.name] = [];
    });

    data[day] = {
      cardioData: createInitialCardioState(),
      strengthData: [createInitialStrengthRow()],
      muscleLinks: muscleLinks,
    };
  });
  return data;
};

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('RESUMEN');
    const [summaryData, setSummaryData] = useState<SummaryData>([]);
    const [workoutData, setWorkoutData] = useState<AllWorkoutData>(createInitialAllWorkoutData());
    const [postureLinks, setPostureLinks] = useState<string[]>([]);
    const [savedExercises, setSavedExercises] = useState<SavedExercise[]>([]);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<string>('');

    const handleSave = useCallback((day: string, type: 'cardio' | 'strength', exerciseName: string, data: CardioRow | StrengthRow) => {
        if (!data.date) {
            console.warn("Saving data without a date.");
        }

        const entryId = `${day}-${type}-${exerciseName.replace(/\s+/g, '-')}-${data.date}`;
        
        const newEntry: SummaryEntry = {
            id: entryId,
            day,
            type,
            exerciseName,
            data,
        };

        setSummaryData(prevData => {
            const existingEntryIndex = prevData.findIndex(entry => entry.id === entryId);

            if (existingEntryIndex !== -1) {
                const updatedData = [...prevData];
                updatedData[existingEntryIndex] = newEntry;
                return updatedData;
            } else {
                return [...prevData, newEntry];
            }
        });
        setNotificationMessage("Datos guardados");
        setShowNotification(true);
    }, []);

    const handleSaveDay = useCallback((day: string, dayData: DayData) => {
        const newEntriesForDay: SummaryEntry[] = [];

        const cardio = dayData.cardioData;
        const hasSomeCardioData = !!(cardio.time || cardio.speed || cardio.incline || cardio.calories || cardio.distance);
        if (hasSomeCardioData && cardio.date) {
            newEntriesForDay.push({
                id: `${day}-cardio-Cardio-${cardio.date}`,
                day,
                type: 'cardio',
                exerciseName: 'Cardio',
                data: cardio,
            });
        }

        dayData.strengthData.forEach((strengthRow) => {
            const exerciseName = strengthRow.exerciseName || 'Ejercicio sin nombre';
            if ((strengthRow.series.reps || strengthRow.series.kgs) && strengthRow.date) {
                newEntriesForDay.push({
                    id: `${day}-strength-${exerciseName.replace(/\s+/g, '-')}-${strengthRow.date}`,
                    day,
                    type: 'strength',
                    exerciseName,
                    data: strengthRow,
                });
            }
        });
        
        setSummaryData(prevData => {
            const entriesMap = new Map<string, SummaryEntry>();
            prevData.forEach(entry => entriesMap.set(entry.id, entry));
            newEntriesForDay.forEach(entry => entriesMap.set(entry.id, entry));
            return Array.from(entriesMap.values());
        });

        if (newEntriesForDay.length > 0) {
            setNotificationMessage("Datos guardados");
            setShowNotification(true);
        }
    }, []);

    const handleDeleteSummaryEntry = useCallback((idToDelete: string) => {
        setSummaryData(prevData => prevData.filter(entry => entry.id !== idToDelete));
    }, []);

    const handleDeleteAllSummary = useCallback(() => {
        setSummaryData([]);
    }, []);
    
    const handleSaveExercise = useCallback((exercise: SavedExercise) => {
        setSavedExercises(prev => {
            const existingIndex = prev.findIndex(e => e.exerciseName === exercise.exerciseName);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = exercise;
                return updated;
            }
            return [...prev, exercise];
        });
        setNotificationMessage("Ejercicio guardado en 'Mis Ejercicios'");
        setShowNotification(true);
    }, []);

    const handleDeleteSavedExercise = useCallback((exerciseName: string) => {
        setSavedExercises(prev => prev.filter(e => e.exerciseName !== exerciseName));
    }, []);

    const handleWorkoutDataChange = useCallback((day: string, newDayData: DayData) => {
        setWorkoutData(prev => ({ ...prev, [day]: newDayData }));
    }, []);

    const handlePostureLinksChange = useCallback((newLinks: string[]) => {
        setPostureLinks(newLinks);
    }, []);

    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => {
                setShowNotification(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showNotification]);

    const renderContent = () => {
        if (activeTab === 'RESUMEN') {
            return <Summary data={summaryData} onDelete={handleDeleteSummaryEntry} onDeleteAll={handleDeleteAllSummary} />;
        }
        if (activeTab === 'MIS EJERCICIOS') {
            return <MyExercises savedExercises={savedExercises} onDelete={handleDeleteSavedExercise} />;
        }
        const dayConfig = WORKOUT_ROUTINE[activeTab as keyof typeof WORKOUT_ROUTINE] as WorkoutDayConfig;
        const dayData = workoutData[activeTab];

        return <WorkoutDay 
            key={activeTab} 
            day={activeTab} 
            config={dayConfig} 
            dayData={dayData}
            postureLinks={postureLinks}
            onDataChange={handleWorkoutDataChange}
            onPostureLinksChange={handlePostureLinksChange}
            onSave={handleSave} 
            onSaveAll={handleSaveDay}
            onSaveExercise={handleSaveExercise}
        />;
    };

    return (
        <div className="bg-slate-900 text-slate-200 min-h-screen font-sans pt-8 pb-12 px-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-sky-400 tracking-wider">PROGRESIÓN DE CARGA</h1>
                    <p className="text-slate-400 mt-2">Registra y visualiza tu evolución en el gimnasio.</p>
                </header>

                <nav className="flex flex-wrap justify-center border-b border-slate-700 mb-8">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 px-4 sm:px-6 text-sm sm:text-base font-medium border-b-2 transition-colors duration-300 ease-in-out focus:outline-none
                                ${activeTab === tab 
                                    ? 'border-sky-400 text-sky-400' 
                                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                                }`
                            }
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                <main>
                    {renderContent()}
                </main>
            </div>
            <Notification show={showNotification} message={notificationMessage} />
        </div>
    );
};

export default App;