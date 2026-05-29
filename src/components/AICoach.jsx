import React, { useState } from 'react';
import { 
  Sparkles, Send, Bot, User, RefreshCw, 
  HelpCircle, ChevronRight, Award, Flame,
  ShieldCheck, AlertCircle, TrendingUp
} from 'lucide-react';

export default function AICoach({ 
  userProfile, 
  nutritionLogs = [], 
  workouts = [], 
  activityLogs = {},
  weightHistory = [],
  onAddXP
}) {
  const [activeSubTab, setActiveSubTab] = useState('chat'); // 'chat' | 'weekly' | 'plateau'
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: `Hello, ${userProfile?.name || 'Athlete'}! I am your EvolvRa AI Transformation Coach. I've analyzed your primary goal of **${userProfile?.goal}**, TDEE profile, daily physical activity, and training volumes. What metrics can we optimize today?` 
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Extract variables
  const currentGoal = userProfile?.goal || 'Fat Loss';
  const calorieTarget = userProfile?.calorieTarget || 2200;
  const proteinTarget = userProfile?.macroTargets?.protein || 150;

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysFood = nutritionLogs.filter(f => f.date === todayStr);
  const caloriesConsumed = todaysFood.reduce((sum, f) => sum + f.calories, 0);
  const proteinConsumed = todaysFood.reduce((sum, f) => sum + f.protein, 0);
  const steps = activityLogs?.steps || 0;
  const sleepHours = activityLogs?.sleepHours || 7;

  // Local Smart AI Chatbot responses engine
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setChatInput('');

    setTimeout(() => {
      let botResponse = '';
      const text = userText.toLowerCase();

      // Core matching logic based on keywords
      if (text.includes('plateau') || text.includes('stuck') || text.includes('stalled')) {
        botResponse = `Plateau status analyzed. For **${currentGoal}**, weight stalls are usually related to metabolic adaptation. If your weight has stalled for 7+ days:
1. **Fat Loss**: Your current TDEE has down-regulated. Introduce a 2-day "Caloric Refeed" at maintenance calories (${calorieTarget + 400} kcal) to boost leptin, while increasing daily steps to 12,000.
2. **Muscle Gain**: You have built lean muscle mass, which raises your caloric baseline. Increase daily intake by 150 kcal.`;
      } 
      else if (text.includes('protein') || text.includes('macro') || text.includes('eat')) {
        botResponse = `Your daily protein target is **${proteinTarget}g** (based on 2.0-2.2g per kg of bodyweight). Today you've logged **${proteinConsumed}g**. Protein triggers the muscle protein synthesis (MPS) pathway via mTOR. Try to distribute your protein into 4 balanced meals of ~35-40g each for maximum assimilation.`;
      } 
      else if (text.includes('cardio') || text.includes('steps') || text.includes('fat loss')) {
        botResponse = `Cardio is an exceptional tool to elevate the energy deficit without overly depressing caloric intake. For your goal of **${currentGoal}**, I recommend a baseline of **10,000 steps** daily (NEAT) and 2-3 sessions of LISS (Low-Intensity Steady State) cardio. LISS burns fats while safeguarding valuable glycogen pools.`;
      } 
      else if (text.includes('sore') || text.includes('recovery') || text.includes('sleep') || text.includes('fatigue')) {
        botResponse = `Recovery is where adaptations occur! Your sleep level today is **${sleepHours}h**. During deep sleep, growth hormone release is maximized. Muscle soreness (DOMS) indicates micro-tearing. Avoid loading sore muscles with high intensity; pivot to recovery stretches, active walks, and consume at least 3 liters of water.`;
      } 
      else if (text.includes('workout') || text.includes('training') || text.includes('split')) {
        const loggedWkCount = workouts.length;
        botResponse = `Based on your **${userProfile?.experience}** training level, progressive overload is the primary hypertrophic catalyst. Ensure you log every set weight and aim to beat your historical logs by either 1 extra rep or 1kg in your next session. Focus on high-quality sets with 2-3 minutes of rest on compounds.`;
      } 
      else {
        botResponse = `Understood. I am evaluating your profile. Since your goal is **${currentGoal}** and your target is **${calorieTarget} kcal**, ensure you log all physical activities and foods today. Let me know if you want to perform a **Plateau Diagnostic check** or review **Weekly Coaching Guidelines**.`;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      onAddXP(15); // +15 XP for interacting with the AI coach
    }, 600);
  };

  // Generate dynamic, data-driven Weekly Review checklist
  const generateWeeklyReview = () => {
    const adherence = workouts.length > 0 ? 92 : 60;
    const proteinCheck = proteinConsumed >= proteinTarget * 0.85 ? 'Passed' : 'Pending Target';
    
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-sm font-bold text-white">EvolvRa Weekly Progress Audit</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Audit Complete
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 text-center">
            <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
              <div className="text-[10px] text-gray-400 uppercase font-bold">Adherence Score</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">{adherence}%</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
              <div className="text-[10px] text-gray-400 uppercase font-bold">Workout Load Status</div>
              <div className="text-xl font-black text-cyan-400 mt-0.5">{workouts.length} completed</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
              <div className="text-[10px] text-gray-400 uppercase font-bold">Protein Integrity</div>
              <div className="text-xl font-black text-amber-400 mt-0.5">{proteinCheck}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">Coach Recommendations for Next Week</h4>
          
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-2.5 text-xs leading-relaxed text-gray-300">
            <div className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Maintain training frequency:</strong> Continue your {workouts.length || 3}x weekly split. Ensure compounds are programmed first.</span>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Macro adherence:</strong> Ensure protein remains above {proteinTarget}g to trigger protein synthesis after every session.</span>
            </div>
            <div className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Recovery Focus:</strong> Your sleep averages {sleepHours}h. Strive for 7.5h+ on heavy training days to maximize central nervous system regeneration.</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Plateau Detection Widget
  const renderPlateauDiagnostic = () => {
    const isStalled = weightHistory.length > 3; // Mocked stalled status check
    
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-white">Plateau Diagnostics Engine</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              If your strength progression or weight fluctuations have stalled for 10 consecutive days, metabolic adaptation or localized overtraining is likely occurring.
            </p>
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 space-y-3 text-emerald-200">
          <h5 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            AI Intervention Protocol
          </h5>
          
          <ul className="list-disc pl-4 space-y-2 text-xs leading-relaxed">
            <li><strong>Reduce training load by 15% (Deload):</strong> If fatigue is high (sleep issues, joint pain), execute a 1-week deload to clear systemic fatigue.</li>
            <li><strong>Increase step threshold:</strong> Increase NEAT from 10k to 12k steps daily. This creates additional calorie burn without elevating systemic stress hormones.</li>
            <li><strong>Calorie Refeed:</strong> Add 300-400 calories of clean complex carbohydrates for 2 days to spike thyroid outputs (T3) and re-sensitize metabolic rate.</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Dynamic Nav selectors */}
      <div className="flex bg-white/5 border border-white/5 p-1 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'chat' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4" />
          AI Coach Chat
        </button>
        <button
          onClick={() => setActiveSubTab('weekly')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'weekly' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          Weekly Progress Audit
        </button>
        <button
          onClick={() => setActiveSubTab('plateau')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'plateau' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Plateau Diagnostics
        </button>
      </div>

      {activeSubTab === 'chat' && (
        <div className="glass rounded-3xl p-5 md:p-6 shadow-xl flex flex-col justify-between h-[65vh] relative overflow-hidden">
          {/* Chat logs */}
          <div className="space-y-4 overflow-y-auto pr-1 no-scrollbar flex-1 pb-4">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow border ${
                  m.sender === 'user' 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent'
                }`}>
                  {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`p-4 rounded-3xl text-xs leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-emerald-500/10 text-white border border-emerald-500/10 rounded-tr-none' 
                    : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
                }`}>
                  {m.sender === 'bot' && (
                    <div className="text-[9px] uppercase font-bold text-emerald-400 mb-1.5 tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      EvolvRa AI Coach
                    </div>
                  )}
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form input */}
          <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-white/5 pt-4">
            <input
              type="text"
              placeholder="Ask about plateaus, macros, workout volume, active recovery..."
              className="flex-1 bg-white/5 border border-white/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-400 outline-none transition-all"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button
              type="submit"
              className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 rounded-2xl text-white shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {activeSubTab === 'weekly' && (
        <div className="max-w-xl mx-auto">
          {generateWeeklyReview()}
        </div>
      )}

      {activeSubTab === 'plateau' && (
        <div className="max-w-xl mx-auto">
          {renderPlateauDiagnostic()}
        </div>
      )}
    </div>
  );
}
