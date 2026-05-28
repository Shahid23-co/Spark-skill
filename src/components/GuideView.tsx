import { useState } from "react";
import { Compass, Sparkles, ChevronRight, Coins, Calendar, Trophy, Send, BrainCircuit, Heart, Info, RotateCcw } from "lucide-react";
import { CareerRoadmap, UserProfile } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface GuideViewProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  onActivateCareerPath: (pathName: string) => void;
  activePath: string | null;
}

export default function GuideView({
  profile,
  onUpdateProfile,
  onActivateCareerPath,
  activePath,
}: GuideViewProps) {
  const [interests, setInterests] = useState("");
  const [experience, setExperience] = useState("");
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);

  const loadingTexts = [
    "Spinning up the SkillSpark Career Engine...",
    "Scanning creator industry gig requirements...",
    "Synthesizing high-CTR visual structures with Gemini AI...",
    "Drafting your personalized learning calendar...",
    "Formulating XP levels and coin payouts..."
  ];

  const handleGenerate = async () => {
    if (!interests.trim() || isLoading) return;

    setIsLoading(true);
    setRoadmap(null);
    setLoadStep(0);

    // Stagger loading messages for an immersive feel
    const loadTimer = setInterval(() => {
      setLoadStep((prev) => (prev + 1) % loadingTexts.length);
    }, 1500);

    try {
      const response = await fetch("/api/ai/career-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: interests,
          currentSkills: experience,
        })
      });

      if (!response.ok) {
        throw new Error("Failed to load Gemini Career Advice");
      }

      const data = await response.json();
      setRoadmap(data);
    } catch (err) {
      console.error(err);
      // Fallback fallback is handled cleanly by server.ts, but let's double check
    } finally {
      clearInterval(loadTimer);
      setIsLoading(false);
    }
  };

  const handleActivatePath = (path: CareerRoadmap) => {
    onActivateCareerPath(path.careerPath);
    
    // Add custom XP bonus for mapping future career!
    const isNew = !profile.unlockedAchievements.includes("ai-mapped");
    const updatedAchievements = isNew ? [...profile.unlockedAchievements, "ai-mapped"] : profile.unlockedAchievements;
    const updatedXp = isNew ? profile.xp + 100 : profile.xp;

    onUpdateProfile({
      ...profile,
      unlockedAchievements: updatedAchievements,
      xp: updatedXp
    });
  };

  const currentLevelNumber = Math.floor(profile.xp / 300) + 1;

  return (
    <div className="space-y-6 pb-20 font-sans">
      <div>
        <h1 className="text-xl font-extrabold text-white tracking-tight font-display">AI Career Guide</h1>
        <p className="text-xs text-neutral-400 mt-0.5">Let Gemini build your custom master roadmap from scratch.</p>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          // Immersive loading deck
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 text-center space-y-4 bg-[#0A0A0B] rounded-2xl border border-cyan-500/20 py-16 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/5"
          >
            <div className="w-14 h-14 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center relative shadow-lg shadow-cyan-500/10">
              <BrainCircuit className="w-7 h-7 animate-pulse text-cyan-300" />
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
            </div>
            <div className="space-y-1 max-w-xs">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Dreaming Big</h4>
              <p className="text-[11px] text-neutral-400 animate-pulse transition-all duration-300">
                {loadingTexts[loadStep]}
              </p>
            </div>
          </motion.div>
        ) : !roadmap ? (
          // Ask Interest Form
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4 bg-[#0A0A0B] p-5 rounded-2xl border border-white/5 shadow-xl"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 block font-mono uppercase tracking-wider">
                1. What are you obsessed with? 🌟
              </label>
              <textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Examples: I love gaming, watching YouTube edits, digital painting, making TikTok content, building Roblox maps..."
                className="w-full bg-[#050505] rounded-xl p-3 text-xs text-white border border-[#1C1C1E] placeholder-neutral-500 focus:outline-none focus:border-cyan-400 h-24 resize-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 block font-mono uppercase tracking-wider">
                2. Any skills already? (Be honest! No experience is 100% fine) 💻
              </label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. Zero experience, or 'I edited 2 montages on CapCut', 'Did minor HTML classes'"
                className="w-full bg-[#050505] rounded-xl p-3 text-xs text-white border border-[#1C1C1E] placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!interests.trim()}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-purple-600 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all cursor-pointer font-display disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              Consult AI Advisor <Sparkles className="w-4 h-4 fill-white text-white animate-pulse" />
            </button>

            {activePath && (
              <div className="mt-4 pt-4 border-t border-white/5 flex gap-2.5 items-center bg-[#050505] p-3 rounded-xl border border-white/5">
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                <p className="text-[10px] text-neutral-400 leading-normal">
                  Your active goal is <strong className="text-cyan-300 font-display">{activePath}</strong>. Talk with Sparky mentor in the bottom right corner for step-by-step guidance.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          // Formulated Roadmap Viewer
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* Header outline card */}
            <div className="bg-[#0A0A0B] p-5 rounded-2xl border border-cyan-500/25 text-center space-y-3 relative overflow-hidden shadow-lg shadow-sleek-cyan">
              <button
                onClick={() => setRoadmap(null)}
                className="absolute top-4 left-4 p-1.5 bg-[#050505] hover:bg-neutral-900 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer text-[10px] flex items-center gap-1 border border-white/5 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" /> Start Over
              </button>

              <div className="pt-4 shrink-0">
                <span className="bg-cyan-400/15 border border-cyan-400/30 text-[9px] text-cyan-300 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                  RECOMMENDED BY AI
                </span>
                <h2 className="text-lg font-black text-white mt-2 tracking-tight leading-snug font-display">
                  {roadmap.careerPath}
                </h2>
              </div>

              {/* Grid indicators */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] uppercase font-mono font-bold">
                <div className="p-2 bg-neutral-900/60 rounded-xl border border-white/5">
                  <Coins className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <span className="text-[8px] text-neutral-500 block">Est. Yield</span>
                  <span className="text-white font-sans text-xs">{roadmap.estimatedSalary.split("(")[0]}</span>
                </div>
                <div className="p-2 bg-neutral-900/60 rounded-xl border border-white/5">
                  <Calendar className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <span className="text-[8px] text-neutral-500 block">Duration</span>
                  <span className="text-white font-sans text-xs">{roadmap.timelineWeeks} Weeks</span>
                </div>
                <div className="p-2 bg-neutral-900/60 rounded-xl border border-white/5">
                  <Trophy className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                  <span className="text-[8px] text-neutral-500 block">Difficulty</span>
                  <span className="text-white font-sans text-xs">{roadmap.difficulty}</span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-400 leading-relaxed text-left pt-2 px-1">
                {roadmap.description}
              </p>
            </div>

            {/* Steps Timeline Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono px-1">Roadmap Timeline Nodes</h3>
              <div className="relative border-l-2 border-neutral-800 ml-4 pl-6 space-y-6">
                {roadmap.roadmapSteps.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Node marker */}
                    <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-[#050505] border-2 border-cyan-400 text-cyan-300 text-xs font-bold font-mono flex items-center justify-center shadow-lg shadow-cyan-500/10">
                      {idx + 1}
                    </div>

                    {/* Step description card */}
                    <div className="bg-[#0A0A0B] p-4 rounded-xl border border-white/5 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-white leading-snug font-display">{step.title}</h4>
                        <span className="bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0">
                          +{step.xpValue} XP
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-normal pt-1">{step.description}</p>
                      
                      <div className="pt-2 flex items-center text-[9px] font-mono font-bold text-neutral-500">
                        ⏱️ Target Study Timer: {step.estimatedDays} days
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Set Active Roadmap trigger */}
            <button
              onClick={() => handleActivatePath(roadmap)}
              disabled={activePath === roadmap.careerPath}
              className={`w-full py-3 text-xs font-extrabold rounded-xl transition-all font-display cursor-pointer ${
                activePath === roadmap.careerPath
                  ? "bg-[#0A0A0B] text-neutral-500 border border-neutral-700/50 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-400 to-purple-600 text-white shadow-lg shadow-cyan-500/25 hover:opacity-95"
              }`}
            >
              {activePath === roadmap.careerPath
                ? "🚀 Selected as Active Spark Goal"
                : "🌟 Lock in & Track this Career Roadmap"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
