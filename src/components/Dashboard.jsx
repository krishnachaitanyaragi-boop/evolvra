import React from 'react';
import { 
  Sparkles, Flame, Footprints, Dumbbell, Droplet, 
  Moon, CheckCircle2, TrendingDown, Calendar, RefreshCw 
} from 'lucide-react';

export default function Dashboard({ 
  userProfile, 
  nutritionLogs = [], 
  workouts = [], 
  activityLogs = {}, 
  weightHistory = [],
  recoveryScore = 82,
  onAddWater,
  onNavigate
}) {
  // Goal-based design configuration mapping
  const goalConfigs = {
    'Fat Loss': {
      accent: 'rose-500',
      accentBg: 'bg-rose-500/10',
      accentBorder: 'border-rose-500/20',
      glow: 'shadow-rose-500/10',
      gradient: 'from-rose-500 to-orange-500',
      tagline: 'Aggressive Fat Loss Deficit Active'
    },
    'Muscle Gain': {
      accent: 'emerald-500',
      accentBg: 'bg-emerald-500/10',
      accentBorder: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/10',
      gradient: 'from-emerald-500 to-teal-500',
      tagline: 'Anabolic Muscle Building Surplus Active'
    },
    'Lean Bulk': {
      accent: 'cyan-400',
      accentBg: 'bg-cyan-500/10',
      accentBorder: 'border-cyan-500/20',
      glow: 'shadow-cyan-400/10',
      gradient: 'from-cyan-400 to-blue-500',
      tagline: 'Controlled Lean Bulking Mode Active'
    },
    'Body Recomposition': {
      accent: 'purple-500',
      accentBg: 'bg-purple-500/10',
      accentBorder: 'border-purple-500/20',
      glow: 'shadow-purple-500/10',
      gradient: 'from-purple-500 to-pink-500',
      tagline: 'Body Recomp Optimization Active'
    },
    'Maintenance': {
      accent: 'amber-500',
      accentBg: 'bg-amber-500/10',
      accentBorder: 'border-amber-500/20',
      glow: 'shadow-amber-500/10',
      gradient: 'from-amber-500 to-yellow-500',
      tagline: 'Energy Homeostasis & Peak Recovery Active'
    }
  };

  const currentGoal = userProfile?.goal || 'Fat Loss';
  const config = goalConfigs[currentGoal];

  // Helper: Filter logs for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysFood = nutritionLogs.filter(f => f.date === todayStr);
  const todaysWorkouts = workouts.filter(w => w.date === todayStr);
  
  // Daily Nutrition Computations
  const calorieGoal = userProfile?.calorieTarget || 2200;
  const caloriesConsumed = todaysFood.reduce((sum, f) => sum + f.calories, 0);
  const proteinConsumed = todaysFood.reduce((sum, f) => sum + f.protein, 0);
  const carbsConsumed = todaysFood.reduce((sum, f) => sum + f.carbs, 0);
  const fatConsumed = todaysFood.reduce((sum, f) => sum + f.fat, 0);

  const proteinGoal = userProfile?.macroTargets?.protein || 150;
  const carbsGoal = userProfile?.macroTargets?.carbs || 220;
  const fatGoal = userProfile?.macroTargets?.fat || 70;

  // Daily Activity Metrics
  const stepsCompleted = activityLogs?.steps || 0;
  const stepsGoal = 10000;
  const caloriesBurnedActivity = Math.round(stepsCompleted * 0.04) + (todaysWorkouts.reduce((sum, w) => sum + (w.duration * 6 || 0), 0));
  const netCalories = caloriesConsumed - caloriesBurnedActivity;
  const caloriesRemaining = Math.max(0, calorieGoal - netCalories);

  const waterIntake = activityLogs?.waterIntake || 0;
  const waterGoal = 3.5; // liters
  const sleepHours = activityLogs?.sleepHours || 7;
  
  // Consistency Score formula: based on steps, water, sleep, calories adherence
  const calorieDiff = Math.abs(caloriesConsumed - calorieGoal);
  const calorieScore = calorieDiff < 200 ? 100 : Math.max(0, 100 - Math.round((calorieDiff - 200) / 10));
  const stepsScore = Math.min(100, Math.round((stepsCompleted / stepsGoal) * 100));
  const waterScore = Math.min(100, Math.round((waterIntake / waterGoal) * 100));
  const consistencyScore = Math.round((calorieScore * 0.4) + (stepsScore * 0.3) + (waterScore * 0.2) + (sleepHours >= 7 ? 10 : 5));

  // AI Heuristics Insight Engine (Custom local AI simulation)
  const getAIInsights = () => {
    const insights = [];
    if (caloriesConsumed === 0) {
      return ["Start logging your meals to unlock real-time EvolvRa AI coaching feedback.", "Remember to prioritize protein targets early today!"];
    }

    if (proteinConsumed < proteinGoal * 0.7) {
      insights.push(`Protein intake is currently too low (${proteinConsumed}g logged vs ${proteinGoal}g target). Incorporate eggs, chicken, or paneer in your next meal.`);
    } else if (proteinConsumed >= proteinGoal) {
      insights.push("Excellent! Daily protein target achieved. Anabolic threshold unlocked.");
    }

    if (currentGoal === 'Fat Loss') {
      if (caloriesConsumed > calorieGoal) {
        insights.push("Calorie surplus detected. To sustain a healthy fat deficit, limit snacking and prioritize high-volume veggies.");
      } else if (caloriesConsumed < calorieGoal - 800) {
        insights.push("Your calorie deficit is highly aggressive today. Ensure you don't compromise lean body tissue.");
      } else {
        insights.push("Splendid! Deficit adherence is spot-on. Fat oxidation rate is maximized.");
      }
    } else if (currentGoal === 'Muscle Gain' || currentGoal === 'Lean Bulk') {
      if (caloriesConsumed < calorieGoal - 200) {
        insights.push("Caloric input is below anabolic target. Consume nutrient-dense foods to hit your growth surplus.");
      } else {
        insights.push("Perfect. Caloric surplus achieved. Strength & glycogen replenishment optimized.");
      }
    }

    if (stepsCompleted < 5000) {
      insights.push("NEAT/Activity is lagging. Take a brief 10-minute walk to keep your metabolic rate elevated.");
    }

    if (workouts.length > 0) {
      const recent = workouts[workouts.length - 1];
      const chestSets = recent.exercises?.filter(e => e.muscleGroup === 'Chest').length || 0;
      const legSets = recent.exercises?.filter(e => e.muscleGroup === 'Legs' || e.muscleGroup === 'Quads' || e.muscleGroup === 'Hamstrings').length || 0;
      if (chestSets > 8 && legSets === 0) {
        insights.push("Leg frequency is relatively low. Plan a quad/hamstring focused session soon to balance loading.");
      }
    }

    if (recoveryScore < 50) {
      insights.push("Recovery index is dropping. Reduce intensity today, emphasize hydration, and prioritize 8 hours of sleep.");
    } else if (recoveryScore > 85 && caloriesConsumed >= calorieGoal * 0.9) {
      insights.push("Peak readiness index detected. Optimal conditions present for high-intensity training overload.");
    }

    return insights.slice(0, 3); // show top 3 insights
  };

  const aiInsights = getAIInsights();

  // Dynamic Calorie SVG Arc calculations
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progressRatio = calorieGoal > 0 ? Math.min(caloriesConsumed / calorieGoal, 1) : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Premium Header Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
        {/* Decorative Grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-${config.accent}/10 text-${config.accent} border border-${config.accent}/20`}>
              {currentGoal}
            </span>
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Today
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1.5 font-display">
            Welcome back, <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">{userProfile?.name || 'Athlete'}</span>
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">{config.tagline}</p>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto shrink-0 relative z-10">
          <button 
            onClick={() => onNavigate('coach')}
            className="w-full flex items-center gap-2.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-2xl py-2.5 px-4 text-emerald-300 hover:text-white transition-all shadow-lg shadow-emerald-500/5 hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-left">
              <div className="text-[9px] uppercase font-bold text-emerald-400">Ask EvolvRa Coach</div>
              <div className="text-xs font-semibold text-gray-300">Generate Weekly Audit</div>
            </div>
          </button>
          
          <a 
            href="https://github.com/krishnachaitanyaragi-boop/evolvra/releases/latest/download/EvolvRa.apk"
            download
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-rose-500/30 rounded-2xl py-2.5 px-4 text-rose-300 hover:text-white transition-all shadow-lg shadow-rose-500/5 hover:scale-[1.02] text-center"
          >
            <Dumbbell className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="text-left">
              <div className="text-[9px] uppercase font-bold text-rose-400">Install Native App</div>
              <div className="text-xs font-semibold text-gray-300">Download Mobile APK</div>
            </div>
          </a>
        </div>
      </div>

      {/* Main Grid: Calorie Ring & Macros */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorie Ring Card */}
        <div className="glass rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 self-start">Calorie Ring</h3>
          
          <div className="relative flex items-center justify-center my-6">
            <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
              <circle
                stroke="rgba(255,255,255,0.05)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke={`url(#calorieGrad)`}
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                className="ring-spin"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <defs>
                <linearGradient id="calorieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Calories Text overlay inside ring */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black font-display text-white">{caloriesConsumed}</span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">of {calorieGoal} kcal</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full text-center border-t border-white/5 pt-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Burned</span>
              <span className="text-sm font-bold text-gray-200">{caloriesBurnedActivity} kcal</span>
            </div>
            <div className="flex flex-col border-x border-white/5">
              <span className="text-xs text-gray-400">Net Calories</span>
              <span className="text-sm font-bold text-emerald-400">{netCalories} kcal</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Remaining</span>
              <span className="text-sm font-bold text-gray-200">{caloriesRemaining} kcal</span>
            </div>
          </div>
        </div>

        {/* Macro Breakdown */}
        <div className="glass rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-5">Daily Macro Targets</h3>
            <div className="space-y-4">
              {/* Protein */}
              <div>
                <div className="flex justify-between items-end mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-gray-300">Protein</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400">
                    <strong className="text-white">{proteinConsumed}g</strong> / {proteinGoal}g
                  </span>
                </div>
                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${Math.min(100, (proteinConsumed / proteinGoal) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div>
                <div className="flex justify-between items-end mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span className="text-xs font-bold text-gray-300">Carbs</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400">
                    <strong className="text-white">{carbsConsumed}g</strong> / {carbsGoal}g
                  </span>
                </div>
                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-cyan-400 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${Math.min(100, (carbsConsumed / carbsGoal) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Fats */}
              <div>
                <div className="flex justify-between items-end mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold text-gray-300">Fat</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400">
                    <strong className="text-white">{fatConsumed}g</strong> / {fatGoal}g
                  </span>
                </div>
                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${Math.min(100, (fatConsumed / fatGoal) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/5 border border-white/5 rounded-2xl text-[11px] text-gray-400 leading-normal flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>Adhering to macro ratios prevents metabolic deceleration and maximizes hypertrophy triggers.</span>
          </div>
        </div>

        {/* AI Daily Insights */}
        <div className="glass rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              AI Coach Insights
            </h3>
            
            <div className="space-y-3">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className="flex gap-2.5 items-start bg-white/5 border border-white/5 p-3 rounded-2xl">
                  <span className="text-xs mt-0.5">💡</span>
                  <p className="text-xs text-gray-300 leading-normal">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate('coach')}
            className="w-full py-2.5 mt-3 rounded-2xl bg-white/5 hover:bg-white/8 text-xs font-bold text-gray-300 transition-all"
          >
            Review Historical Recommendations
          </button>
        </div>
      </div>

      {/* Goal Progress Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goal Progress weight widget */}
        <div className="glass rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Goal Progress Trend</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400">Current Weight</div>
              <div className="text-3xl font-black font-display text-white">
                {userProfile?.weight || 75} <span className="text-lg font-bold text-gray-400">{userProfile?.units || 'kg'}</span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-400">Target Weight</div>
              <div className="text-3xl font-black font-display text-white">
                {userProfile?.targetWeight || 70} <span className="text-lg font-bold text-gray-400">{userProfile?.units || 'kg'}</span>
              </div>
            </div>
          </div>

          {/* Goal timeline bar */}
          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-400">
              <span>Goal Progress Rate</span>
              <span>Estimated: ~6 weeks</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div 
                className={`bg-gradient-to-r ${config.gradient} h-full rounded-full transition-all`}
                style={{ 
                  width: `${Math.min(
                    100, 
                    Math.max(
                      10, 
                      Math.round(
                        (Math.abs(parseFloat(userProfile?.weight || 75) - 85) / Math.abs(parseFloat(userProfile?.targetWeight || 70) - 85)) * 100
                      ) || 40
                    )
                  )}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Transformation Summary */}
        <div className="glass rounded-3xl p-6 shadow-xl">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Daily Transformation Metrics</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Steps */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">Steps</span>
                <Footprints className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2">
                <div className="text-lg font-bold text-white">{stepsCompleted.toLocaleString()}</div>
                <div className="text-[10px] text-gray-400">Target: 10,000</div>
              </div>
            </div>

            {/* Workouts */}
            <div 
              onClick={() => onNavigate('workout')}
              className="bg-white/5 border border-white/5 hover:border-emerald-500/30 rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all"
            >
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">Workouts</span>
                <Dumbbell className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-2">
                <div className="text-lg font-bold text-white">{todaysWorkouts.length}</div>
                <div className="text-[10px] text-gray-400">Logged Today</div>
              </div>
            </div>

            {/* Water */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">Hydration</span>
                <Droplet className="w-4 h-4 text-blue-400" />
              </div>
              <div className="mt-2 flex justify-between items-end">
                <div>
                  <div className="text-lg font-bold text-white">{waterIntake}L</div>
                  <div className="text-[10px] text-gray-400">Target: {waterGoal}L</div>
                </div>
                <button 
                  onClick={onAddWater}
                  className="bg-blue-500/20 text-blue-300 font-bold hover:bg-blue-500 hover:text-white rounded-lg p-1 text-xs transition-all"
                >
                  +250ml
                </button>
              </div>
            </div>

            {/* Sleep */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">Sleep</span>
                <Moon className="w-4 h-4 text-purple-400" />
              </div>
              <div className="mt-2">
                <div className="text-lg font-bold text-white">{sleepHours}h</div>
                <div className="text-[10px] text-gray-400">Target: 7.5h</div>
              </div>
            </div>

            {/* Recovery */}
            <div 
              onClick={() => onNavigate('recovery')}
              className="bg-white/5 border border-white/5 hover:border-emerald-500/30 rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-all"
            >
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">Recovery</span>
                <RefreshCw className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2">
                <div className="text-lg font-bold text-amber-400">{recoveryScore}%</div>
                <div className="text-[10px] text-gray-400">Readiness Score</div>
              </div>
            </div>

            {/* Consistency */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-[10px] uppercase font-bold tracking-wider">Consistency</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2">
                <div className="text-lg font-bold text-emerald-400">{consistencyScore}%</div>
                <div className="text-[10px] text-gray-400">EvolvRa Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
