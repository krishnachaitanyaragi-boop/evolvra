import React from 'react';
import { 
  Award, Zap, Flame, Footprints, Droplet, 
  Sparkles, CheckCircle2, ShieldCheck, Trophy 
} from 'lucide-react';

export default function Gamification({ 
  gamification = {}, 
  onAddXP 
}) {
  const level = gamification?.level || 1;
  const xp = gamification?.xp || 0;
  
  // Level threshold calculation: Level 1 -> 500 XP, Level 2 -> 1000 XP etc.
  const nextLevelXP = level * 600;
  const xpPercentage = Math.min(100, Math.round((xp / nextLevelXP) * 100));

  const badges = [
    { 
      id: 'bdg-protein', 
      title: 'Protein Overlord', 
      desc: 'Achieve daily protein target 5 days consecutively.', 
      icon: Trophy, 
      color: 'from-amber-400 to-yellow-500',
      unlocked: xp >= 300 
    },
    { 
      id: 'bdg-workout', 
      title: 'Tough as Steel', 
      desc: 'Record a workout volume load over 2,000kg.', 
      icon: Zap, 
      color: 'from-rose-500 to-orange-500', 
      unlocked: xp >= 150
    },
    { 
      id: 'bdg-steps', 
      title: 'NEAT Explorer', 
      desc: 'Surpass 15,000 steps logged in a single day.', 
      icon: Footprints, 
      color: 'from-cyan-400 to-blue-500', 
      unlocked: xp >= 400
    },
    { 
      id: 'bdg-sleep', 
      title: 'Sleep Anabolism', 
      desc: 'Achieve 8+ hours of sleep on a heavy leg training day.', 
      icon: ShieldCheck, 
      color: 'from-purple-500 to-pink-500', 
      unlocked: xp >= 100
    }
  ];

  const handleClaimDailyXP = () => {
    onAddXP(50);
    alert('Daily consistency award claimed! +50 XP!');
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-xl mx-auto">
      {/* Level Summary */}
      <div className="glass rounded-3xl p-6 shadow-xl relative overflow-hidden text-center space-y-4">
        {/* Glow grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        
        <div className="relative z-10 space-y-2">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 border border-emerald-400/20 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 font-display">
            {level}
          </div>
          <h2 className="text-xl font-extrabold font-display">Level {level} EvolvRa Athlete</h2>
          <p className="text-xs text-gray-400">Log meals, finish workouts, and hit steps goals to earn XP and unlock legendary badges.</p>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-1.5 relative z-10">
          <div className="flex justify-between text-xs font-semibold text-gray-400">
            <span>XP Progress</span>
            <span className="text-emerald-400">{xp} / {nextLevelXP} XP</span>
          </div>
          <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-700" 
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleClaimDailyXP}
          className="relative z-10 py-2.5 px-6 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/20 text-xs font-bold transition-all shadow-md"
        >
          Claim Daily Consistency Bonus (+50 XP)
        </button>
      </div>

      {/* Badges and Achievements */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 pl-1 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-emerald-400" />
          Unlockable Performance Badges
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div 
                key={b.id} 
                className={`border rounded-2xl p-4 flex gap-4 items-center transition-all ${
                  b.unlocked 
                    ? 'bg-white/5 border-emerald-500/20 hover:border-emerald-500/40' 
                    : 'bg-white/5 border-white/5 opacity-50'
                }`}
              >
                <div className={`p-3 rounded-xl bg-gradient-to-r ${b.color} text-white shadow shadow-white/5 shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    {b.title}
                    {b.unlocked ? (
                      <span className="px-1.5 py-0.2 rounded-md text-[8px] uppercase bg-emerald-500/10 text-emerald-400 font-extrabold border border-emerald-500/20">Unlocked</span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded-md text-[8px] uppercase bg-gray-500/10 text-gray-400 font-extrabold border border-white/5">Locked</span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 leading-snug">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
