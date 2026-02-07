import React from 'react';
import { DailySummary, WorkoutItem } from '../types';
import { Portal } from './Portal';
import { StreakFlame } from './StreakFlame';
// Actually StreakFlame is likely not exported from BentoGrid based on previous reads. 
// I should check if StreakFlame is exported or just inline.
// It was imported in BentoGrid: import { StreakFlame } from './StreakFlame'; 
// So I can import it directly.

interface WorkoutOverviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Merged history including today's live data
    history: DailySummary[];
    // Today's specific workouts for detailed view
    todayWorkouts: WorkoutItem[];
    streak: number;
}

export const WorkoutOverviewModal: React.FC<WorkoutOverviewModalProps> = ({
    isOpen,
    onClose,
    history,
    todayWorkouts,
    streak
}) => {
    if (!isOpen) return null;

    // Calculate some aggregate stats for the header
    const totalWorkouts = history.reduce((acc, day) => acc + day.workoutCount, 0);
    const totalCalories = history.reduce((acc, day) => acc + day.caloriesBurned, 0);

    // Group history by month for a nicer list? 
    // For now, simple list is fine.

    // Filter out days with 0 activity to keep the list relevant
    const activeDays = history.filter(day => day.workoutCount > 0 || day.caloriesBurned > 0);

    return (
        <Portal>
            <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/40 backdrop-blur-sm px-4 py-4 animate-fade-in"
                onClick={onClose}
            >
                <div
                    className="bg-[var(--background)] w-full max-w-lg rounded-3xl border border-border shadow-2xl overflow-hidden backdrop-blur-md flex flex-col max-h-[85vh]"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-border bg-white/50 dark:bg-black/20 shrink-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-charcoal dark:text-stone-200 font-serif flex items-center gap-2">
                                    <span className="text-flame">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path d="M15.232 5.232l3.536 3.536a2.5 2.5 0 1 1-3.536 3.536L6.5 3.5 3.5 6.5l8.732 8.732a2.5 2.5 0 1 1-3.536 3.536L5.232 15.232l-1.768 1.768a2.5 2.5 0 0 0 3.536 3.536l1.768-1.768 8.732 8.732 3-3-8.732-8.732 1.768-1.768a2.5 2.5 0 1 1 3.536 3.536l-1.768-1.768 3.536-3.536-1.768-1.768z" />
                                        </svg>
                                    </span>
                                    Activity Log
                                </h2>
                                <div className="flex gap-4 mt-2 text-xs font-bold uppercase tracking-wider text-muted">
                                    <span>{totalWorkouts} Workouts</span>
                                    <span>{totalCalories} Active Kcal</span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 bg-[var(--input-bg)] border border-transparent rounded-full text-muted hover:text-[var(--text-main)] transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Streak Banner */}
                        {streak > 0 && (
                            <div className="mt-4 bg-flame/10 border border-flame/20 rounded-xl p-3 flex items-center gap-3">
                                <div className="p-2 bg-flame text-white rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2c-.3 0-.6.1-.9.4-1.2 1.3-2.6 3.3-3.1 5.6-.2 1-.2 2.3.5 3.5.7 1.2 2 2.2 3.4 2.5 1.5.3 3 .1 4.2-.7 1.2-.8 2-2.1 2.3-3.5.3-1.4.1-2.9-.6-4.2-.7-1.3-1.8-2.4-3.1-3.2-.8-.6-1.7-1-2.7-1.1zm.5 12.8c-1.2.6-2.5.5-3.6-.2-1.1-.7-1.8-1.9-1.9-3.2 0-.8.2-1.6.5-2.3-1.1 1.7-1.5 3.8-1.1 5.9.4 2.1 1.9 3.9 3.9 4.7 2 .8 4.3.4 6-1 .2-.2.4-.4.6-.6-.1.1-.2.2-.4.3-1.1.7-2.6.9-4 .4z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-flame font-bold text-sm">{streak} Day Streak!</p>
                                    <p className="text-xs text-muted">Keep the fire burning.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-0">
                        {/* Today's Detailed View */}
                        {todayWorkouts.length > 0 && (
                            <div className="p-6 pb-2">
                                <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-3 sticky top-0 bg-[var(--background)] py-2 z-10">Today</h3>
                                <div className="space-y-3">
                                    {todayWorkouts.map((workout) => (
                                        <div key={workout.id} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--input-bg)] border border-border">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-workout/10 flex items-center justify-center text-workout">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M20.2 17.6l-2.7-11.5c-.5-2.2-2.9-3.4-5-2.6C9.9 4.4 7.6 6.8 7.3 10.1L6.7 15l-3.3 1.3c-.9.4-1.3 1.4-1 2.3.2.6.7 1 1.3 1.2l4.8 1.4c.5.1 1 .2 1.5.2 2 0 3.9-1 5-2.7l4.3-1.7c.9-.4 1.3-1.4 1-2.3-.2-.5-.6-.9-1.1-1.1z" />
                                                        {/* Simple generic activity icon */}
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-charcoal dark:text-stone-200">{workout.type}</p>
                                                    <p className="text-xs text-muted">
                                                        {new Date(workout.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-serif font-bold text-lg text-charcoal dark:text-stone-200">{workout.caloriesBurned}</p>
                                                <p className="text-[10px] font-bold text-muted uppercase">kcal</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* History List */}
                        <div className="p-6 pt-2">
                            <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-3 sticky top-0 bg-[var(--background)] py-2 z-10">History</h3>
                            <div className="space-y-2">
                                {activeDays.length === 0 ? (
                                    <div className="text-center py-8 text-muted">
                                        <p>No history yet.</p>
                                    </div>
                                ) : (
                                    activeDays.map((summary) => {
                                        const isToday = summary.date === new Date().toISOString().split('T')[0];
                                        if (isToday) return null; // Already showed detailed view

                                        return (
                                            <div key={summary.date} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--input-bg)] transition-colors border border-transparent hover:border-border">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-stone-100 dark:bg-white/5 border border-border">
                                                        <span className="text-[10px] font-bold text-muted uppercase">{new Date(summary.date).toLocaleString('en-US', { month: 'short' })}</span>
                                                        <span className="text-sm font-bold text-charcoal dark:text-stone-200">{new Date(summary.date).getDate()}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-charcoal dark:text-stone-200">{summary.workoutCount} Workout{summary.workoutCount !== 1 ? 's' : ''}</p>
                                                        <p className="text-xs text-muted">Daily Summary</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-serif font-bold text-charcoal dark:text-stone-200">{summary.caloriesBurned}</span>
                                                    <span className="text-xs text-muted ml-1">kcal</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};
