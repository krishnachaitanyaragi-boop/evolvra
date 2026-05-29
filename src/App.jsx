import React, { useState, useEffect } from 'react';
import { 
  Flame, Footprints, Dumbbell, Apple, Activity, 
  BarChart2, Sparkles, RefreshCw, Award, User, 
  Menu, X 
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
import NutritionTracker from './components/NutritionTracker';
import ActivityTracker from './components/ActivityTracker';
import ProgressAnalytics from './components/ProgressAnalytics';
import AICoach from './components/AICoach';
import RecoverySystem from './components/RecoverySystem';
import Gamification from './components/Gamification';
import Settings from './components/Settings';
import GoalSystem from './components/GoalSystem';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Centralized State
  const [userProfile, setUserProfile] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [activityLogs, setActivityLogs] = useState({});
  const [weightHistory, setWeightHistory] = useState([]);
  const [gamification, setGamification] = useState({ xp: 120, level: 1 });

  // On mount: Load localStorage or populate beautiful, realistic sample data for instant WOW factor!
  useEffect(() => {
    const profileSaved = localStorage.getItem('evolvra_profile');
    const workoutsSaved = localStorage.getItem('evolvra_workouts');
    const nutritionSaved = localStorage.getItem('evolvra_nutrition');
    const activitySaved = localStorage.getItem('evolvra_activity');
    const weightSaved = localStorage.getItem('evolvra_weight');
    const gamificationSaved = localStorage.getItem('evolvra_gamification');

    if (profileSaved) {
      setUserProfile(JSON.parse(profileSaved));
    }
    if (workoutsSaved) setWorkouts(JSON.parse(workoutsSaved));
    else {
      // Sample workouts
      const samples = [
        {
          id: 'wk-sample1',
          date: '2026-05-28',
          name: 'Hypertrophy Pull',
          duration: 55,
          exercises: [
            { name: 'Weighted Pull-Ups', muscleGroup: 'Back', sets: [{ reps: 8, weight: 10, rpe: 9 }, { reps: 8, weight: 10, rpe: 8 }] },
            { name: 'Barbell Row', muscleGroup: 'Back', sets: [{ reps: 10, weight: 60, rpe: 8 }] },
            { name: 'Incline Hammer Curl', muscleGroup: 'Biceps', sets: [{ reps: 12, weight: 12, rpe: 8 }] }
          ]
        }
      ];
      setWorkouts(samples);
      localStorage.setItem('evolvra_workouts', JSON.stringify(samples));
    }

    if (nutritionSaved) setNutritionLogs(JSON.parse(nutritionSaved));
    else {
      // Sample nutrition logs for today
      const todayStr = new Date().toISOString().split('T')[0];
      const samples = [
        { id: 'fd-s1', date: todayStr, name: 'Whey Protein Scoop + Banana', calories: 225, protein: 25, carbs: 29, fat: 2, mealType: 'Breakfast' },
        { id: 'fd-s2', date: todayStr, name: 'Paneer Curry with Roti', calories: 490, protein: 22, carbs: 48, fat: 25, mealType: 'Lunch' }
      ];
      setNutritionLogs(samples);
      localStorage.setItem('evolvra_nutrition', JSON.stringify(samples));
    }

    if (activitySaved) setActivityLogs(JSON.parse(activitySaved));
    else {
      const todaySample = { steps: 6800, waterIntake: 1.75, sleepHours: 7.5, activeMinutes: 40, mood: 4, stress: 2, energy: 4, soreness: 2 };
      setActivityLogs(todaySample);
      localStorage.setItem('evolvra_activity', JSON.stringify(todaySample));
    }

    if (weightSaved) setWeightHistory(JSON.parse(weightSaved));
    else {
      const samples = [
        { date: '2026-05-01', weight: 77.2, waist: 84 },
        { date: '2026-05-08', weight: 76.5, waist: 83 },
        { date: '2026-05-15', weight: 75.8, waist: 82.5 },
        { date: '2026-05-22', weight: 75.2, waist: 82 },
        { date: '2026-05-29', weight: 74.6, waist: 81.5 },
      ];
      setWeightHistory(samples);
      localStorage.setItem('evolvra_weight', JSON.stringify(samples));
    }

    if (gamificationSaved) setGamification(JSON.parse(gamificationSaved));
  }, []);

  // Save state helpers
  const handleSaveProfile = (profile) => {
    setUserProfile(profile);
    localStorage.setItem('evolvra_profile', JSON.stringify(profile));
  };

  const handleSaveWorkout = (workout) => {
    const updated = [...workouts, workout];
    setWorkouts(updated);
    localStorage.setItem('evolvra_workouts', JSON.stringify(updated));

    // Auto update daily activity metrics for calories burned
    const durationCalBurn = Math.round(workout.duration * 6.5);
    const updatedAct = {
      ...activityLogs,
      activeMinutes: (activityLogs.activeMinutes || 0) + workout.duration
    };
    setActivityLogs(updatedAct);
    localStorage.setItem('evolvra_activity', JSON.stringify(updatedAct));
  };

  const handleDeleteWorkout = (id) => {
    const updated = workouts.filter(w => w.id !== id);
    setWorkouts(updated);
    localStorage.setItem('evolvra_workouts', JSON.stringify(updated));
  };

  const handleLogFood = (food) => {
    const updated = [...nutritionLogs, food];
    setNutritionLogs(updated);
    localStorage.setItem('evolvra_nutrition', JSON.stringify(updated));
  };

  const handleDeleteFood = (id) => {
    const updated = nutritionLogs.filter(f => f.id !== id);
    setNutritionLogs(updated);
    localStorage.setItem('evolvra_nutrition', JSON.stringify(updated));
  };

  const handleUpdateActivity = (metrics) => {
    const updated = { ...activityLogs, ...metrics };
    setActivityLogs(updated);
    localStorage.setItem('evolvra_activity', JSON.stringify(updated));
  };

  const handleLogWeight = (entry) => {
    const updated = [...weightHistory, entry];
    setWeightHistory(updated);
    localStorage.setItem('evolvra_weight', JSON.stringify(updated));

    // Update weight parameter in active profile
    if (userProfile) {
      const updatedProfile = { ...userProfile, weight: entry.weight };
      setUserProfile(updatedProfile);
      localStorage.setItem('evolvra_profile', JSON.stringify(updatedProfile));
    }
  };

  const handleAddXP = (amount) => {
    let newXP = gamification.xp + amount;
    let newLevel = gamification.level;
    const nextLvlThreshold = newLevel * 600;

    if (newXP >= nextLvlThreshold) {
      newXP -= nextLvlThreshold;
      newLevel += 1;
      alert(`🎉 Level Up! You reached Level ${newLevel} EvolvRa Athlete!`);
    }

    const updated = { xp: newXP, level: newLevel };
    setGamification(updated);
    localStorage.setItem('evolvra_gamification', JSON.stringify(updated));
  };

  const handleResetData = () => {
    localStorage.clear();
    setUserProfile(null);
    setWorkouts([]);
    setNutritionLogs([]);
    setActivityLogs({ steps: 0, waterIntake: 0 });
    setWeightHistory([]);
    setGamification({ xp: 0, level: 1 });
    setCurrentView('dashboard');
  };

  // Nav views mapping
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Flame },
    { id: 'workout', label: 'Workouts', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'progress', label: 'Analytics', icon: BarChart2 },
    { id: 'coach', label: 'AI Coach', icon: Sparkles },
    { id: 'recovery', label: 'Recovery', icon: RefreshCw },
    { id: 'gamification', label: 'Levels', icon: Award },
    { id: 'settings', label: 'Settings', icon: User },
  ];

  const handleQuickAddWater = () => {
    handleUpdateActivity({ waterIntake: parseFloat(((activityLogs?.waterIntake || 0) + 0.25).toFixed(2)) });
    handleAddXP(10);
  };

  // If profile is completely blank, enforce initial onboarding survey!
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#070a13] text-gray-100 flex items-center justify-center p-4">
        <GoalSystem userProfile={null} onSaveProfile={handleSaveProfile} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a13] text-gray-100 flex flex-col md:flex-row relative">
      
      {/* Top Mobile Bar */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span className="font-display font-black text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            EvolvRa
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 bg-white/5 rounded-xl border border-white/5"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-64 glass z-50 md:z-30 transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between p-6 shrink-0`}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-2 pl-2">
            <span className="text-2xl">⚡</span>
            <span className="font-display font-black text-2xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              EvolvRa
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Small Profile Pill */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center font-display shadow">
            {userProfile?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">{userProfile?.name || 'Athlete'}</div>
            <div className="text-[9px] text-emerald-400 font-semibold">{userProfile?.goal}</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 px-4 md:px-8 py-6 max-w-5xl mx-auto w-full md:pb-6 pb-24">
        {currentView === 'dashboard' && (
          <Dashboard 
            userProfile={userProfile} 
            nutritionLogs={nutritionLogs}
            workouts={workouts}
            activityLogs={activityLogs}
            weightHistory={weightHistory}
            onAddWater={handleQuickAddWater}
            onNavigate={(v) => setCurrentView(v)}
          />
        )}
        {currentView === 'workout' && (
          <WorkoutTracker 
            workouts={workouts}
            onSaveWorkout={handleSaveWorkout}
            onDeleteWorkout={handleDeleteWorkout}
            onAddXP={handleAddXP}
          />
        )}
        {currentView === 'nutrition' && (
          <NutritionTracker 
            userProfile={userProfile}
            nutritionLogs={nutritionLogs}
            onLogFood={handleLogFood}
            onDeleteFood={handleDeleteFood}
            onAddXP={handleAddXP}
          />
        )}
        {currentView === 'activity' && (
          <ActivityTracker 
            activityLogs={activityLogs}
            onUpdateActivity={handleUpdateActivity}
            onAddXP={handleAddXP}
          />
        )}
        {currentView === 'progress' && (
          <ProgressAnalytics 
            userProfile={userProfile}
            weightHistory={weightHistory}
            workouts={workouts}
            nutritionLogs={nutritionLogs}
            onLogWeight={handleLogWeight}
            onAddXP={handleAddXP}
          />
        )}
        {currentView === 'coach' && (
          <AICoach 
            userProfile={userProfile}
            nutritionLogs={nutritionLogs}
            workouts={workouts}
            activityLogs={activityLogs}
            weightHistory={weightHistory}
            onAddXP={handleAddXP}
          />
        )}
        {currentView === 'recovery' && (
          <RecoverySystem 
            userProfile={userProfile}
            activityLogs={activityLogs}
            workouts={workouts}
            onAddXP={handleAddXP}
          />
        )}
        {currentView === 'gamification' && (
          <Gamification 
            gamification={gamification}
            onAddXP={handleAddXP}
          />
        )}
        {currentView === 'settings' && (
          <Settings 
            userProfile={userProfile}
            onSaveProfile={handleSaveProfile}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Mobile Bottom Sticky Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass z-40 px-4 py-3 flex justify-between border-t border-white/5">
        {[
          { id: 'dashboard', label: 'Home', icon: Flame },
          { id: 'workout', label: 'Work', icon: Dumbbell },
          { id: 'nutrition', label: 'Eat', icon: Apple },
          { id: 'activity', label: 'Move', icon: Activity },
          { id: 'coach', label: 'Coach', icon: Sparkles }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'text-emerald-400' : 'text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-bold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
