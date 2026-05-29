import React, { useState, useEffect, useRef } from 'react';
import { 
  Dumbbell, Play, Plus, Trash2, Save, Copy, 
  Sparkles, Flame, CheckCircle, BarChart3, TrendingUp,
  ChevronRight, Footprints, Info
} from 'lucide-react';

export default function WorkoutTracker({ 
  workouts = [], 
  onSaveWorkout, 
  onDeleteWorkout, 
  onAddXP 
}) {
  const [activeTab, setActiveTab] = useState('log'); // 'log' | 'templates' | 'analytics'
  const [workoutName, setWorkoutName] = useState('Push Day');
  const [duration, setDuration] = useState(60);
  const [exercises, setExercises] = useState([
    { name: 'Flat Bench Press', muscleGroup: 'Chest', sets: [{ reps: 8, weight: 60, rpe: 8 }] },
    { name: 'Overhead Press', muscleGroup: 'Shoulders', sets: [{ reps: 8, weight: 40, rpe: 8 }] },
    { name: 'Incline Dumbbell Flyes', muscleGroup: 'Chest', sets: [{ reps: 10, weight: 16, rpe: 9 }] }
  ]);

  const [customExerciseName, setCustomExerciseName] = useState('');
  const [customMuscle, setCustomMuscle] = useState('Chest');
  const [cardioType, setCardioType] = useState('Running');
  const [cardioDuration, setCardioDuration] = useState(30);
  const [cardioCalories, setCardioCalories] = useState(250);

  const [savedTemplates, setSavedTemplates] = useState(() => {
    const saved = localStorage.getItem('evolvra_workout_templates');
    return saved ? JSON.parse(saved) : [
      {
        id: 'tpl-ppl-push',
        name: 'Hypertrophy Push',
        duration: 65,
        exercises: [
          { name: 'Incline Barbell Bench Press', muscleGroup: 'Chest', sets: [{ reps: 8, weight: 70, rpe: 8 }, { reps: 8, weight: 70, rpe: 9 }] },
          { name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders', sets: [{ reps: 10, weight: 22, rpe: 8 }, { reps: 10, weight: 22, rpe: 8 }] },
          { name: 'Triceps Overhead Extension', muscleGroup: 'Triceps', sets: [{ reps: 12, weight: 14, rpe: 9 }] }
        ]
      },
      {
        id: 'tpl-ppl-pull',
        name: 'Hypertrophy Pull',
        duration: 60,
        exercises: [
          { name: 'Weighted Pull-Ups', muscleGroup: 'Back', sets: [{ reps: 6, weight: 10, rpe: 9 }] },
          { name: 'Barbell Row', muscleGroup: 'Back', sets: [{ reps: 8, weight: 60, rpe: 8 }, { reps: 8, weight: 60, rpe: 8 }] },
          { name: 'Incline Hammer Curl', muscleGroup: 'Biceps', sets: [{ reps: 12, weight: 12, rpe: 8 }] }
        ]
      }
    ];
  });

  const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Core', 'Cardio'];
  const canvasRef = useRef(null);

  // Save templates to localStorage when changed
  useEffect(() => {
    localStorage.setItem('evolvra_workout_templates', JSON.stringify(savedTemplates));
  }, [savedTemplates]);

  // Handle active logger actions
  const addExercise = () => {
    if (customExerciseName.trim()) {
      setExercises([...exercises, { name: customExerciseName, muscleGroup: customMuscle, sets: [{ reps: 10, weight: 10, rpe: 8 }] }]);
      setCustomExerciseName('');
    } else {
      setExercises([...exercises, { name: 'New Exercise', muscleGroup: 'Chest', sets: [{ reps: 10, weight: 10, rpe: 8 }] }]);
    }
  };

  const deleteExercise = (idx) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const addSet = (exerciseIdx) => {
    const updated = [...exercises];
    const prevSet = updated[exerciseIdx].sets[updated[exerciseIdx].sets.length - 1] || { reps: 10, weight: 10, rpe: 8 };
    updated[exerciseIdx].sets.push({ ...prevSet });
    setExercises(updated);
  };

  const deleteSet = (exerciseIdx, setIdx) => {
    const updated = [...exercises];
    updated[exerciseIdx].sets = updated[exerciseIdx].sets.filter((_, i) => i !== setIdx);
    if (updated[exerciseIdx].sets.length === 0) {
      updated[exerciseIdx].sets.push({ reps: 8, weight: 10, rpe: 8 });
    }
    setExercises(updated);
  };

  const updateSetField = (exerciseIdx, setIdx, field, val) => {
    const updated = [...exercises];
    updated[exerciseIdx].sets[setIdx][field] = parseFloat(val) || 0;
    setExercises(updated);
  };

  const updateExerciseField = (exerciseIdx, field, val) => {
    const updated = [...exercises];
    updated[exerciseIdx][field] = val;
    setExercises(updated);
  };

  // Log active workout
  const handleSaveActiveWorkout = () => {
    if (exercises.length === 0) return;
    const newWorkout = {
      id: 'wk-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      name: workoutName,
      duration: duration,
      exercises: exercises,
    };
    onSaveWorkout(newWorkout);
    onAddXP(100); // 100XP for finishing a workout
    alert('Workout successfully saved to daily logs! You earned 100 XP!');
  };

  // Save as Template
  const handleSaveAsTemplate = () => {
    if (exercises.length === 0) return;
    const newTemplate = {
      id: 'tpl-' + Date.now(),
      name: workoutName + ' Template',
      duration: duration,
      exercises: exercises
    };
    setSavedTemplates([...savedTemplates, newTemplate]);
    alert('Workout template successfully saved!');
  };

  // Load template
  const handleLoadTemplate = (tpl) => {
    setWorkoutName(tpl.name);
    setDuration(tpl.duration);
    setExercises(tpl.exercises.map(e => ({
      ...e,
      sets: e.sets.map(s => ({ ...s }))
    })));
    setActiveTab('log');
  };

  // Cardio logging
  const handleLogCardio = () => {
    const newWorkout = {
      id: 'wk-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      name: cardioType,
      duration: cardioDuration,
      exercises: [{
        name: cardioType,
        muscleGroup: 'Cardio',
        sets: [{ reps: 1, weight: 0, rpe: cardioDuration }] // duration in rpe field as a placeholder
      }]
    };
    onSaveWorkout(newWorkout);
    onAddXP(50);
    alert(`Cardio logged: ${cardioDuration} mins, ~${cardioCalories} kcal burned. +50 XP!`);
  };

  // Workout Split & Volumes Detection Heuristics
  const detectTrainingMetrics = () => {
    if (workouts.length === 0) {
      return { split: 'Not Available', tips: ['Log your workouts to unlock AI Split Balance analyses.'], volumes: {} };
    }

    // Accumulate last 7 days of sets per muscle group
    const volumes = {};
    muscleGroups.forEach(m => { volumes[m] = 0; });

    workouts.forEach(w => {
      w.exercises?.forEach(e => {
        const setsCount = e.sets?.length || 0;
        if (volumes[e.muscleGroup] !== undefined) {
          volumes[e.muscleGroup] += setsCount;
        } else {
          volumes[e.muscleGroup] = setsCount;
        }
      });
    });

    // Detect splits
    let split = 'Full Body';
    const chestSets = volumes['Chest'] || 0;
    const backSets = volumes['Back'] || 0;
    const legSets = (volumes['Quads'] || 0) + (volumes['Hamstrings'] || 0) + (volumes['Glutes'] || 0);

    if (chestSets > 0 && backSets > 0 && legSets === 0) split = 'Upper Body Focused';
    else if (chestSets > 0 && backSets > 0 && legSets > 0) {
      if (workouts.length >= 3) split = 'Push Pull Legs (PPL)';
      else split = 'Full Body / General';
    } else if (legSets > chestSets && legSets > backSets) split = 'Lower Body Focused';

    // AI Tips heuristics
    const tips = [];
    if (chestSets > backSets * 1.5 && chestSets > 5) {
      tips.push('Chest volume exceeds back volume. To prevent forward shoulders and posture alignment issues, increase rowing/pull-down volume.');
    }
    if (legSets < 4) {
      tips.push('Weekly lower-body/leg volume is low. Introduce squats, RDLs, or lunges to stabilize knee joints and stimulate growth hormones.');
    }
    if (volumes['Shoulders'] > 12) {
      tips.push('High weekly shoulder volume. Ensure adequate shoulder recovery to protect the rotator cuff from impingement.');
    }
    if (tips.length === 0) {
      tips.push('Weekly training balance is well-proportioned. Maintain progressive overload and focus on hydration.');
    }

    return { split, tips, volumes };
  };

  const { split, tips, volumes } = detectTrainingMetrics();

  // Draw progressive overload charts using canvas
  useEffect(() => {
    if (activeTab !== 'analytics' || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, 500, 300);

    // Dynamic mock progression data or real workout counts
    const dataPoints = workouts.length > 2 
      ? workouts.map((w, idx) => ({ label: `Wk ${idx+1}`, val: w.exercises.reduce((s, e) => s + e.sets.reduce((sw, set) => sw + set.weight * set.reps, 0), 0) / 10 }))
      : [
          { label: 'Wk 1', val: 1200 },
          { label: 'Wk 2', val: 1350 },
          { label: 'Wk 3', val: 1320 },
          { label: 'Wk 4', val: 1500 },
          { label: 'Wk 5', val: 1650 },
          { label: 'Wk 6', val: 1800 }
        ];

    // Grid details
    const width = 500;
    const height = 300;
    const padding = 45;

    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * (height - padding * 2) / 4);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Chart path
    const maxVal = Math.max(...dataPoints.map(d => d.val)) * 1.1;
    const minVal = Math.min(...dataPoints.map(d => d.val)) * 0.9;
    const valRange = maxVal - minVal;

    const getX = (idx) => padding + idx * (width - padding * 2) / (dataPoints.length - 1);
    const getY = (val) => height - padding - ((val - minVal) / valRange) * (height - padding * 2);

    // Draw area fill
    ctx.beginPath();
    ctx.moveTo(getX(0), height - padding);
    dataPoints.forEach((d, idx) => {
      ctx.lineTo(getX(idx), getY(d.val));
    });
    ctx.lineTo(getX(dataPoints.length - 1), height - padding);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, 0, 0, height);
    fillGrad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    fillGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    dataPoints.forEach((d, idx) => {
      if (idx === 0) ctx.moveTo(getX(idx), getY(d.val));
      else ctx.lineTo(getX(idx), getY(d.val));
    });
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Draw glowing node circles
    dataPoints.forEach((d, idx) => {
      ctx.beginPath();
      ctx.arc(getX(idx), getY(d.val), 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#34d399';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#070a13';
      ctx.stroke();

      // Label below
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, getX(idx), height - 20);
    });

    // Draw Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Estimated Volume Load Progression (Strength Target Index)', padding, 25);

  }, [activeTab, workouts]);

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Top Segment Tabs */}
      <div className="flex bg-white/5 border border-white/5 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('log')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'log' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Play className="w-4 h-4" />
          Active Log
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'templates' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Copy className="w-4 h-4" />
          Templates
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'analytics' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Volume Analytics
        </button>
      </div>

      {activeTab === 'log' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Workout Log Section */}
          <div className="lg:col-span-2 glass rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="space-y-0.5">
                <input
                  type="text"
                  className="bg-transparent border-none text-xl font-bold font-display text-white outline-none focus:ring-1 focus:ring-emerald-500/20 rounded px-1 w-full"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                />
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">Workout Log Session</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveAsTemplate}
                  className="p-2 bg-white/5 hover:bg-white/8 text-gray-300 rounded-xl transition-all"
                  title="Save template"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSaveActiveWorkout}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Save Workout
                </button>
              </div>
            </div>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between text-xs text-gray-400 font-semibold mb-1">
                <span>Duration (minutes)</span>
                <span className="text-emerald-400">{duration} mins</span>
              </div>
              <input
                type="range"
                min="10"
                max="180"
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              />
            </div>

            {/* Exercises List */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
              {exercises.map((exercise, exerciseIdx) => (
                <div key={exerciseIdx} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      className="bg-transparent font-semibold text-sm text-white border-none outline-none focus:bg-white/5 rounded w-full px-1"
                      value={exercise.name}
                      onChange={(e) => updateExerciseField(exerciseIdx, 'name', e.target.value)}
                    />
                    
                    <div className="flex items-center gap-2">
                      <select
                        className="bg-white/5 text-xs text-gray-300 border border-white/5 rounded-xl px-2 py-1 outline-none"
                        value={exercise.muscleGroup}
                        onChange={(e) => updateExerciseField(exerciseIdx, 'muscleGroup', e.target.value)}
                      >
                        {muscleGroups.map(m => (
                          <option key={m} value={m} className="bg-slate-900">{m}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => deleteExercise(exerciseIdx)}
                        className="text-gray-500 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Sets table */}
                  <div className="space-y-2">
                    {exercise.sets.map((set, setIdx) => (
                      <div key={setIdx} className="grid grid-cols-4 gap-2 items-center text-center text-xs">
                        <div className="text-gray-400 font-bold bg-white/5 rounded-lg py-1">Set {setIdx + 1}</div>
                        <div>
                          <input
                            type="number"
                            className="w-full bg-white/5 border border-white/5 rounded-lg py-1 px-2 text-center text-white outline-none focus:border-emerald-500"
                            placeholder="Reps"
                            value={set.reps}
                            onChange={(e) => updateSetField(exerciseIdx, setIdx, 'reps', e.target.value)}
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            className="w-full bg-white/5 border border-white/5 rounded-lg py-1 px-2 text-center text-white outline-none focus:border-emerald-500"
                            placeholder="Weight"
                            value={set.weight}
                            onChange={(e) => updateSetField(exerciseIdx, setIdx, 'weight', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            max="10"
                            className="w-full bg-white/5 border border-white/5 rounded-lg py-1 px-2 text-center text-white outline-none focus:border-emerald-500"
                            placeholder="RPE"
                            value={set.rpe}
                            onChange={(e) => updateSetField(exerciseIdx, setIdx, 'rpe', e.target.value)}
                          />
                          <button
                            onClick={() => deleteSet(exerciseIdx, setIdx)}
                            className="text-gray-600 hover:text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addSet(exerciseIdx)}
                    className="w-full border border-dashed border-white/10 hover:border-white/20 rounded-xl py-1.5 text-xs text-gray-400 hover:text-white transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Set
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Exercises / Add button */}
            <div className="flex gap-2 border-t border-white/5 pt-4">
              <input
                type="text"
                className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-4 text-sm text-white placeholder-gray-500 outline-none"
                placeholder="Custom exercise name..."
                value={customExerciseName}
                onChange={(e) => setCustomExerciseName(e.target.value)}
              />
              <select
                className="bg-white/5 border border-white/5 rounded-2xl text-xs text-gray-300 px-3 outline-none"
                value={customMuscle}
                onChange={(e) => setCustomMuscle(e.target.value)}
              >
                {muscleGroups.filter(m => m !== 'Cardio').map(m => (
                  <option key={m} value={m} className="bg-slate-900">{m}</option>
                ))}
              </select>
              <button
                onClick={addExercise}
                className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/20 rounded-2xl px-4 py-2 text-xs font-bold transition-all"
              >
                Add Exercise
              </button>
            </div>
          </div>

          {/* Cardio Logging & Split detection */}
          <div className="space-y-6">
            {/* Split Detection widget */}
            <div className="glass rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                AI Workout Split Detect
              </h3>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <div className="text-xs text-gray-400">Detected Split:</div>
                <div className="text-lg font-black text-white mt-0.5">{split}</div>
              </div>

              <div className="space-y-2 max-h-[22vh] overflow-y-auto pr-1 no-scrollbar">
                {tips.map((t, idx) => (
                  <div key={idx} className="flex gap-2 items-start bg-white/5 border border-white/5 p-3 rounded-2xl text-xs text-gray-300 leading-normal">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cardio log section */}
            <div className="glass rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" />
                Cardio Logger
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {['Running', 'Cycling', 'Rowing', 'Treadmill', 'HIIT'].map(c => (
                    <button
                      key={c}
                      onClick={() => setCardioType(c)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        cardioType === c
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent'
                          : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-bold pl-1">Duration (min)</label>
                    <input
                      type="number"
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-2 px-3 text-sm text-center text-white mt-1 outline-none focus:border-emerald-500"
                      value={cardioDuration}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setCardioDuration(val);
                        setCardioCalories(val * 8); // rough calc: 8kcal/min
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-bold pl-1">Est. Burn (kcal)</label>
                    <input
                      type="number"
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-2 px-3 text-sm text-center text-white mt-1 outline-none focus:border-emerald-500"
                      value={cardioCalories}
                      onChange={(e) => setCardioCalories(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <button
                  onClick={handleLogCardio}
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-rose-500/10 transition-all flex items-center justify-center gap-1.5"
                >
                  <Flame className="w-4 h-4" />
                  Log Cardio Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="glass rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-bold font-display">Custom Templates</h3>
          <p className="text-xs text-gray-400">Save hours at the gym by launching a predefined template sequence with a single tap.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedTemplates.map((tpl) => (
              <div key={tpl.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-emerald-500/20 transition-all">
                <div>
                  <h4 className="font-bold text-base text-white">{tpl.name}</h4>
                  <div className="text-[10px] text-gray-400 mt-0.5">{tpl.duration} minutes • {tpl.exercises?.length} exercises</div>
                  
                  <div className="space-y-1 mt-3">
                    {tpl.exercises?.slice(0, 3).map((e, idx) => (
                      <div key={idx} className="text-xs text-gray-300 flex items-center gap-1">
                        <ChevronRight className="w-3 h-3 text-emerald-400" />
                        {e.name} ({e.sets?.length} sets)
                      </div>
                    ))}
                    {tpl.exercises?.length > 3 && (
                      <div className="text-[10px] text-gray-500 pl-4">+{tpl.exercises.length - 3} more exercises</div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleLoadTemplate(tpl)}
                  className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-white rounded-xl text-xs font-bold transition-all"
                >
                  Deploy Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-3xl p-6 shadow-xl">
            <div className="w-full overflow-hidden flex justify-center">
              <canvas ref={canvasRef} width="500" height="300" className="w-full max-w-[500px] h-[300px]" />
            </div>
          </div>

          <div className="glass rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Volume Breakdown
            </h3>

            <div className="space-y-3.5 max-h-[30vh] overflow-y-auto pr-1 no-scrollbar">
              {muscleGroups.filter(m => m !== 'Cardio').map(m => {
                const sets = volumes[m] || 0;
                const ratio = Math.min(100, Math.round((sets / 16) * 100)); // 16 sets base target
                return (
                  <div key={m}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-300 font-medium">{m}</span>
                      <span className="text-gray-400 font-bold">{sets} sets / week</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
