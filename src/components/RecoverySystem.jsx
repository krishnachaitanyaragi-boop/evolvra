import React, { useState } from 'react';
import { 
  Sparkles, RefreshCw, Zap, ShieldAlert, 
  HelpCircle, ShieldCheck, Heart, Moon 
} from 'lucide-react';

export default function RecoverySystem({ 
  userProfile, 
  activityLogs = {}, 
  workouts = [],
  onAddXP
}) {
  const [sorenessSliders, setSorenessSliders] = useState({
    Chest: 2,
    Back: 1,
    Shoulders: 3,
    Biceps: 2,
    Triceps: 2,
    Quads: 1,
    Hamstrings: 1,
    Glutes: 1,
    Calves: 1
  });

  const sleepHours = activityLogs?.sleepHours || 7;
  const waterIntake = activityLogs?.waterIntake || 0;

  // Recovery Engine Heuristic Calculations
  const calculateMuscleRecovery = (muscle) => {
    // Basic baseline
    let score = 100;
    
    // Soreness penalty
    const soreLevel = sorenessSliders[muscle] || 1;
    score -= (soreLevel - 1) * 20; // level 5 soreness = -80%

    // Workout recency penalty
    const recentWorkouts = workouts.slice(-3); // check last 3 logged workouts
    let workImpact = 0;
    recentWorkouts.forEach((w, idx) => {
      const containsMuscle = w.exercises?.find(e => e.muscleGroup === muscle);
      if (containsMuscle) {
        // More recent workouts have higher impact
        workImpact += (idx + 1) * 12;
      }
    });

    score = Math.max(10, Math.min(100, score - workImpact));
    return score;
  };

  const muscles = Object.keys(sorenessSliders);
  const muscleRecoveryStatus = {};
  muscles.forEach(m => {
    muscleRecoveryStatus[m] = calculateMuscleRecovery(m);
  });

  // Daily aggregate readiness score
  const avgMuscleRecovery = Math.round(muscles.reduce((sum, m) => sum + muscleRecoveryStatus[m], 0) / muscles.length);
  const sleepFactor = sleepHours >= 7.5 ? 100 : Math.round((sleepHours / 7.5) * 100);
  const waterFactor = waterIntake >= 3.5 ? 100 : Math.round((waterIntake / 3.5) * 100);
  const readinessScore = Math.round((avgMuscleRecovery * 0.6) + (sleepFactor * 0.3) + (waterFactor * 0.1));

  const handleSorenessChange = (muscle, val) => {
    setSorenessSliders({ ...sorenessSliders, [muscle]: parseInt(val) });
  };

  const handleLogSorenessSubmit = () => {
    onAddXP(40);
    alert(`Soreness matrix logged successfully! Daily readiness score calculated: ${readinessScore}%. +40 XP!`);
  };

  const getReadinessColor = (val) => {
    if (val >= 80) return 'text-emerald-400';
    if (val >= 50) return 'text-amber-400';
    return 'text-rose-500';
  };

  const getMuscleStatusColor = (val) => {
    if (val >= 75) return 'bg-emerald-500';
    if (val >= 45) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Overview Card */}
      <div className="glass rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        {/* Glow grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        
        <div className="space-y-1 relative z-10 text-center md:text-left">
          <h2 className="text-xl font-bold font-display text-white flex items-center justify-center md:justify-start gap-1.5">
            <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin-slow" />
            Muscle Recovery Matrix
          </h2>
          <p className="text-xs text-gray-400 leading-normal">
            Assess local muscular inflammation (DOMS) and combine sleeping/hydration patterns to map total CNS and localized physical readiness.
          </p>
        </div>

        <div className="shrink-0 text-center bg-white/5 border border-white/5 p-4 rounded-3xl min-w-[140px] shadow-xl">
          <div className="text-[10px] text-gray-400 uppercase font-bold">CNS Readiness Index</div>
          <div className={`text-4xl font-black mt-1 font-display ${getReadinessColor(readinessScore)}`}>
            {readinessScore}%
          </div>
          <div className="text-[9px] text-gray-400 mt-1 font-semibold">
            {readinessScore >= 80 ? 'Optimal Performance Mode' : readinessScore >= 50 ? 'Moderate Fatigue' : 'Rest Advised'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Muscle Soreness Sliders log */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Localized Soreness Input</h3>
            <button
              onClick={handleLogSorenessSubmit}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all"
            >
              Update Matrix
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
            {muscles.map((muscle) => {
              const val = sorenessSliders[muscle];
              return (
                <div key={muscle} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-gray-300">
                    <span>{muscle} Soreness</span>
                    <span className={val >= 4 ? 'text-rose-400' : val >= 3 ? 'text-amber-400' : 'text-emerald-400'}>
                      {val === 5 ? 'Severe (DOMS)' : val === 4 ? 'High Sore' : val === 3 ? 'Moderate' : val === 2 ? 'Tightness' : 'Fully Recovered'}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="5"
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    value={val}
                    onChange={(e) => handleSorenessChange(muscle, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time calculated muscle recovery values */}
        <div className="glass rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Muscle Integrity Index</h3>
            
            <div className="space-y-3.5 max-h-[45vh] overflow-y-auto pr-1 no-scrollbar">
              {muscles.map((m) => {
                const recVal = muscleRecoveryStatus[m];
                return (
                  <div key={m} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-300">{m}</span>
                      <span className="font-bold text-white">{recVal}%</span>
                    </div>

                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${getMuscleStatusColor(recVal)}`}
                        style={{ width: `${recVal}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 mt-4 text-[10px] text-gray-400 leading-normal flex items-start gap-2">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>Heavy compound loads require 48-72 hours of complete rest to stimulate complete hypertrophic adaptation.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
