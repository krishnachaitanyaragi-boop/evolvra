import React from 'react';
import { 
  Footprints, Flame, Clock, Moon, Droplet, 
  Smile, Activity, Brain, ShieldAlert, Sparkles 
} from 'lucide-react';

export default function ActivityTracker({ 
  activityLogs = {}, 
  onUpdateActivity, 
  onAddXP 
}) {
  const steps = activityLogs?.steps || 0;
  const sleepHours = activityLogs?.sleepHours || 7;
  const waterIntake = activityLogs?.waterIntake || 0;
  const activeMinutes = activityLogs?.activeMinutes || 0;
  const mood = activityLogs?.mood || 3; // 1-5
  const stress = activityLogs?.stress || 3; // 1-5
  const energy = activityLogs?.energy || 3; // 1-5
  const soreness = activityLogs?.soreness || 1; // 1-5

  // Quick increments
  const handleStepIncrement = (amount) => {
    onUpdateActivity({ steps: Math.max(0, steps + amount) });
    onAddXP(10);
  };

  const handleWaterIncrement = (amount) => {
    onUpdateActivity({ waterIntake: Math.max(0, parseFloat((waterIntake + amount).toFixed(2))) });
    onAddXP(10);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="glass rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Ambient grid glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        <h2 className="text-xl font-bold font-display text-white relative z-10 flex items-center gap-1.5">
          <Activity className="w-5 h-5 text-emerald-400" />
          Frictionless Activity Ledger
        </h2>
        <p className="text-xs text-gray-400 mt-1 relative z-10">
          Quickly log physical neat activity, sleep recovery parameters, and mood indices to evaluate daily training compatibility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Physical Activity */}
        <div className="glass rounded-3xl p-6 shadow-xl space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Footprints className="w-4 h-4 text-emerald-400" />
            Physical Neat Indices
          </h3>

          {/* Steps */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-300">Daily Steps Count</span>
              <span className="text-emerald-400 font-extrabold text-sm">{steps.toLocaleString()} / 10,000</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleStepIncrement(1000)}
                className="flex-1 py-2 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 rounded-xl text-xs font-bold transition-all"
              >
                +1,000 Steps
              </button>
              <button
                onClick={() => handleStepIncrement(3000)}
                className="flex-1 py-2 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 rounded-xl text-xs font-bold transition-all"
              >
                +3,000 Steps
              </button>
            </div>

            <div>
              <input
                type="range"
                min="0"
                max="25000"
                step="500"
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                value={steps}
                onChange={(e) => onUpdateActivity({ steps: parseInt(e.target.value) })}
              />
            </div>
          </div>

          {/* Active Minutes */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-300">Active Movement Minutes</span>
              <span className="text-cyan-400 font-extrabold text-sm">{activeMinutes} mins</span>
            </div>
            
            <div>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                value={activeMinutes}
                onChange={(e) => onUpdateActivity({ activeMinutes: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Sedentary</span>
              <span>Optimal (45m+)</span>
              <span>Extreme</span>
            </div>
          </div>
        </div>

        {/* Daily Hydration & Sleep */}
        <div className="glass rounded-3xl p-6 shadow-xl space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-blue-400" />
            Hydration & Rest Ledger
          </h3>

          {/* Water */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-300">Hydration Intake</span>
              <span className="text-blue-400 font-extrabold text-sm">{waterIntake}L / 3.5L</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleWaterIncrement(0.25)}
                className="flex-1 py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-300 hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                +250 ml Glass
              </button>
              <button
                onClick={() => handleWaterIncrement(0.75)}
                className="flex-1 py-2 bg-blue-500/10 hover:bg-blue-500 text-blue-300 hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                +750 ml Bottle
              </button>
            </div>
          </div>

          {/* Sleep */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-300">Sleep Duration</span>
              <span className="text-purple-400 font-extrabold text-sm">{sleepHours} hours</span>
            </div>

            <div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                value={sleepHours}
                onChange={(e) => onUpdateActivity({ sleepHours: parseFloat(e.target.value) })}
              />
            </div>

            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Restricted</span>
              <span>Anabolic Recovery (7.5h+)</span>
              <span>Deep Sleep</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subjective Wellness Markers */}
      <div className="glass rounded-3xl p-6 shadow-xl space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
          <Brain className="w-4 h-4 text-purple-400" />
          Subjective Wellness Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Mood Slider */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-300">
              <span>Mood Status</span>
              <span className="text-emerald-400">Level {mood} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              value={mood}
              onChange={(e) => onUpdateActivity({ mood: parseInt(e.target.value) })}
            />
            <div className="flex justify-between text-[8px] text-gray-500">
              <span>Low</span>
              <span>Neutral</span>
              <span>Stoked</span>
            </div>
          </div>

          {/* Energy Slider */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-300">
              <span>Energy Index</span>
              <span className="text-cyan-400">Level {energy} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              value={energy}
              onChange={(e) => onUpdateActivity({ energy: parseInt(e.target.value) })}
            />
            <div className="flex justify-between text-[8px] text-gray-500">
              <span>Lethargic</span>
              <span>Balanced</span>
              <span>Supercharged</span>
            </div>
          </div>

          {/* Stress Slider */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-300">
              <span>Stress Index</span>
              <span className="text-amber-400">Level {stress} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
              value={stress}
              onChange={(e) => onUpdateActivity({ stress: parseInt(e.target.value) })}
            />
            <div className="flex justify-between text-[8px] text-gray-500">
              <span>Calm</span>
              <span>Tense</span>
              <span>High Cortisol</span>
            </div>
          </div>

          {/* Soreness Slider */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-gray-300">
              <span>Muscle Soreness</span>
              <span className="text-rose-500">Level {soreness} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
              value={soreness}
              onChange={(e) => onUpdateActivity({ soreness: parseInt(e.target.value) })}
            />
            <div className="flex justify-between text-[8px] text-gray-500">
              <span>Recovered</span>
              <span>Inflamed</span>
              <span>Extreme DOMS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
