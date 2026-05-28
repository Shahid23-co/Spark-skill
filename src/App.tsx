import { useState, useEffect } from "react";
import { 
  Sparkles, BookOpen, Compass, Users, Briefcase, User, 
  Flame, Coins, Laptop, Smartphone, HelpCircle, HardDrive, 
  CloudLightning, Database, ArrowRight, Zap, RefreshCw, Bell, Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, Challenge, Course } from "./types";
import { SAMPLE_CHALLENGES } from "./data";
import { EmulatedDatabase, checkFirebaseReady, isFirebaseActive } from "./utils/firebaseFallback";

// Import Modular Views
import HomeView from "./components/HomeView";
import LearnView from "./components/LearnView";
import GuideView from "./components/GuideView";
import CommunityView from "./components/CommunityView";
import EarnView from "./components/EarnView";
import ProfileView from "./components/ProfileView";
import MentorBot from "./components/MentorBot";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [firebaseActive, setFirebaseActive] = useState(false);
  const [usePhoneFrame, setUsePhoneFrame] = useState(true);
  const [sysTime, setSysTime] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeCareerPath, setActiveCareerPath] = useState<string | null>(null);
  const [notifMessage, setNotifMessage] = useState<string | null>(null);

  // Sync System Time for simulated status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setSysTime(`${hours}:${mins} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize and check Firestore connectivity
  useEffect(() => {
    const initApp = async () => {
      // Sync configurations
      const dbReady = await checkFirebaseReady();
      setFirebaseActive(dbReady);

      // Initialize database with local fallback profiles
      const activeProf = EmulatedDatabase.getProfile();
      setProfile(activeProf);

      // Set active career if already completed
      if (activeProf.unlockedAchievements.includes("ai-mapped")) {
        setActiveCareerPath("Creative Technical Content Producer");
      }

      // Initialize challenges
      const storedChallenges = localStorage.getItem("skillspark_challenges");
      if (storedChallenges) {
        try {
          setChallenges(JSON.parse(storedChallenges));
        } catch (e) {
          setChallenges(SAMPLE_CHALLENGES);
        }
      } else {
        setChallenges(SAMPLE_CHALLENGES);
        localStorage.setItem("skillspark_challenges", JSON.stringify(SAMPLE_CHALLENGES));
      }
    };

    initApp();

    const handleProfileSync = () => {
      setProfile(EmulatedDatabase.getProfile());
    };
    window.addEventListener("skillspark_profile_updated", handleProfileSync);
    return () => window.removeEventListener("skillspark_profile_updated", handleProfileSync);
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-neutral-950 font-sans flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center animate-spin border-2 border-emerald-300 pointer-events-none" />
        <h2 className="text-sm font-bold mt-4 uppercase tracking-wider text-neutral-400">Booting SkillSpark Engine...</h2>
      </div>
    );
  }

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    EmulatedDatabase.saveProfile(newProfile);
  };

  const handleSetAuthUser = (email: string, displayName: string) => {
    const updated = {
      ...profile,
      email: email,
      displayName: displayName
    };
    handleUpdateProfile(updated);
    triggerNotification(`📬 Profile updated for brand node: ${displayName}!`);
  };

  // Triggering visual push notifications simulation
  const triggerNotification = (msg: string) => {
    setNotifMessage(msg);
    setTimeout(() => {
      setNotifMessage(null);
    }, 4500);
  };

  // Interactive challenges complete trigger callback
  const handleCompleteChallengeAction = (actionType: string) => {
    const updatedChallenges = challenges.map((challenge) => {
      if (challenge.type === "daily" && actionType === "watch_lesson" && challenge.id === "chal-daily-2" && !challenge.isCompleted) {
        triggerNotification("🎯 DAILY TASK COMPLETED: Finished 1 lesson! (+80 XP)");
        handleUpdateProfile({ ...profile, xp: profile.xp + 80 });
        return { ...challenge, isCompleted: true };
      }
      if (challenge.type === "weekly" && actionType === "publish_edit" && challenge.id === "chal-weekly-1" && !challenge.isCompleted) {
        triggerNotification("🏆 WEEKLY QUIEST COMPLETED: Shared portfolio showcase! (+250 XP)");
        handleUpdateProfile({ ...profile, xp: profile.xp + 250 });
        return { ...challenge, isCompleted: true };
      }
      if (challenge.type === "weekly" && actionType === "claim_gig" && challenge.id === "chal-weekly-2" && !challenge.isCompleted) {
        triggerNotification("🔑 WEEKLY MISSION COMPLETED: Finished freelance work brief! (+300 XP)");
        handleUpdateProfile({ ...profile, xp: profile.xp + 300 });
        return { ...challenge, isCompleted: true };
      }
      return challenge;
    });

    setChallenges(updatedChallenges);
    localStorage.setItem("skillspark_challenges", JSON.stringify(updatedChallenges));
  };

  // Toggle checklist task from home screen
  const handleToggleChallenge = (id: string) => {
    const updated = challenges.map((challenge) => {
      if (challenge.id === id) {
        const nextState = !challenge.isCompleted;
        if (nextState) {
          triggerNotification(`🎯 Mission Unlocked: ${challenge.title}! (+${challenge.xpReward} XP)`);
          handleUpdateProfile({ ...profile, xp: profile.xp + challenge.xpReward });
        } else {
          handleUpdateProfile({ ...profile, xp: Math.max(0, profile.xp - challenge.xpReward) });
        }
        return { ...challenge, isCompleted: nextState };
      }
      return challenge;
    });

    setChallenges(updated);
    localStorage.setItem("skillspark_challenges", JSON.stringify(updated));
  };

  // Core tab navigator
  const handleNavigateToTab = (tab: string) => {
    setSelectedCourse(null);
    setActiveTab(tab);
  };

  const handleSelectCourseDirect = (course: Course) => {
    setSelectedCourse(course);
    setActiveTab("learn");
  };

  const handleSetCareerGoal = (pathName: string) => {
    setActiveCareerPath(pathName);
    triggerNotification(`🎯 AI-MAPPED: Active career path now set to "${pathName}"!`);
  };

  // Seed simulated cash points or progression for quick UI testing
  const handleSeedCredit = (amount: number, type: "xp" | "coins") => {
    if (type === "xp") {
      handleUpdateProfile({ ...profile, xp: profile.xp + amount });
      triggerNotification(`💎 SEEDED: Added +${amount} XP to your learning rank!`);
    }
  };

  const handleResetSimulation = () => {
    localStorage.removeItem("skillspark_user_profile");
    localStorage.removeItem("skillspark_gigs_list");
    localStorage.removeItem("skillspark_community_feed");
    localStorage.removeItem("skillspark_challenges");
    triggerNotification("🔄 Simulation database cleared. Reloading standard assets...");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-neutral-200 antialiased flex flex-col xl:flex-row items-center justify-center p-0 md:p-6 lg:p-12 relative overflow-x-hidden">
      
      {/* Abstract Background decorations */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0e_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating simulated notifications */}
      <AnimatePresence>
        {notifMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-purple-600 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-cyan-500/20 border border-white/10 flex items-center gap-2.5 z-[99]"
          >
            <Bell className="w-4 h-4 text-cyan-200 animate-bounce" />
            <span className="text-xs font-bold font-display select-none leading-none">{notifMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Column: Title & Desktop Sidebar Description (Hidden on compact frames) */}
      <div className="xl:w-[320px] space-y-6 shrink-0 text-center xl:text-left p-6 xl:p-0 relative z-10 max-w-lg xl:mr-10 xl:block hidden">
        <div className="space-y-4">
          <div className="flex items-center gap-3 justify-center xl:justify-start">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 font-display">
              SkillSpark
            </span>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            High-contrast learn-to-earn ecosystem for digital creators and beginners. Formulate pathways, earn on-demand client commissions, and claim achievements.
          </p>

          <div className="flex flex-col gap-2.5 text-xs text-white/50 pt-1 font-medium">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/5 text-cyan-400">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
              <span>Core Application Hub</span>
            </div>
            <div className="flex items-center justify-between px-3 py-1 text-[11px]">
              <span>System Design</span>
              <span className="text-white/80 font-mono font-bold">V1.2.0-Alpha</span>
            </div>
          </div>
        </div>

        {/* Desktop Administration Console card */}
        <div className="bg-[#0A0A0B] border border-[#1C1C1E] rounded-2xl p-5 space-y-4 shadow-2xl">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" /> Administrative Deck
          </h3>
          
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>Database Sync</span>
              <span className={`font-mono font-bold flex items-center gap-1 ${firebaseActive ? "text-cyan-400" : "text-yellow-400"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${firebaseActive ? "bg-cyan-400" : "bg-yellow-400 animate-ping"}`} />
                {firebaseActive ? "Firebase Linked" : "Local Sandbox Sync"}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>Platform Model</span>
              <span className="font-mono text-purple-400 font-bold">gemini-3.5-flash</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold font-mono">
            <button
              onClick={() => handleSeedCredit(500, "xp")}
              className="p-2.5 bg-[#050505] hover:bg-neutral-900 text-cyan-400 rounded-xl transition-all cursor-pointer border border-[#1C1C1E] text-center flex items-center justify-center gap-1"
            >
              +500 XP Spark
            </button>
            <button
              onClick={handleResetSimulation}
              className="p-2.5 bg-[#050505] hover:bg-neutral-900 text-red-400 rounded-xl transition-all cursor-pointer border border-[#1C1C1E] text-center flex items-center justify-center gap-1"
            >
              Reset Data
            </button>
          </div>

          {/* Interactive frame toggle buttons */}
          <div className="pt-2 border-t border-white/5 flex gap-2">
            <button
              onClick={() => setUsePhoneFrame(true)}
              className={`flex-1 p-2 rounded-lg text-[10px] border-0 font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                usePhoneFrame ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-cyan-500/10" : "bg-[#050505] text-neutral-400 border border-[#1C1C1E]"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Device view
            </button>
            <button
              onClick={() => setUsePhoneFrame(false)}
              className={`flex-1 p-2 rounded-lg text-[10px] border-0 font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                !usePhoneFrame ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md shadow-cyan-500/10" : "bg-[#050505] text-neutral-400 border border-[#1C1C1E]"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" /> Full screen
            </button>
          </div>
        </div>
      </div>

      {/* Main app block, modeled inside a gorgeous smartphone device framing */}
      <div className={`relative z-10 w-full transition-all ${usePhoneFrame ? "max-w-[390px] xl:max-w-[420px]" : "max-w-7xl"}`}>
        
        {/* The high-fidelity smartphone device wrapper */}
        <div className={`overflow-hidden transition-all bg-[#050505] ${
          usePhoneFrame 
            ? "border-[10px] border-[#1c1c1e] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative h-[812px] flex flex-col flex-1" 
            : "rounded-3xl border border-[#1c1c1e] min-h-[700px] flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]"
        }`}>
          
          {/* Smartphone simulated top status bar */}
          {usePhoneFrame && (
            <div className="bg-[#0A0A0B] px-6 pt-3.5 pb-2 select-none flex justify-between items-center z-40 text-neutral-300 text-[10px] font-mono font-bold leading-none shrink-0 border-b border-white/5">
              <span>{sysTime}</span>
              {/* Device camera slit notch */}
              <div className="w-[100px] h-4 bg-[#050505] rounded-full border border-white/5 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-900/40 border border-blue-500/10 transform translate-x-2 scale-95" />
              </div>
              <div className="flex items-center gap-1">
                <span>5G</span>
                <div className="w-4 h-2.5 border border-white/40 rounded flex items-center p-0.5 ml-0.5">
                  <div className="h-full bg-cyan-400 w-full rounded" />
                </div>
              </div>
            </div>
          )}

          {/* Internal Application body segment with customized scrolling */}
          <div className="flex-1 overflow-y-auto px-5 pt-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
            {activeTab === "home" && (
              <HomeView
                profile={profile}
                challenges={challenges}
                onCourseSelect={handleSelectCourseDirect}
                onNavigate={handleNavigateToTab}
                onToggleChallenge={handleToggleChallenge}
              />
            )}
            {activeTab === "learn" && (
              <LearnView
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                selectedCourseFromOutside={selectedCourse}
                onClearOutsideCourse={() => setSelectedCourse(null)}
                challenges={challenges}
                onCompleteChallengeAction={handleCompleteChallengeAction}
              />
            )}
            {activeTab === "guide" && (
              <GuideView
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onActivateCareerPath={handleSetCareerGoal}
                activePath={activeCareerPath}
              />
            )}
            {activeTab === "community" && (
              <CommunityView
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onCompleteChallengeAction={handleCompleteChallengeAction}
              />
            )}
            {activeTab === "earn" && (
              <EarnView
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onCompleteChallengeAction={handleCompleteChallengeAction}
              />
            )}
            {activeTab === "profile" && (
              <ProfileView
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onCourseSelect={handleSelectCourseDirect}
                onSetAuthUser={handleSetAuthUser}
              />
            )}
          </div>

          {/* Smartphone bottom navigation bar with icons and text */}
          <div className="bg-[#0A0A0B]/90 backdrop-blur-md border-t border-white/5 px-3.5 py-3 flex justify-around items-center z-40 select-none shrink-0">
            {[
              { tab: "home", label: "Home", icon: Sparkles },
              { tab: "learn", label: "Learn", icon: BookOpen },
              { tab: "guide", label: "AI Guide", icon: Compass },
              { tab: "community", label: "Showcase", icon: Users },
              { tab: "earn", label: "Earn", icon: Briefcase },
              { tab: "profile", label: "Profile", icon: User },
            ].map((menu) => {
              const IconComp = menu.icon;
              const isActive = activeTab === menu.tab;

              return (
                <button
                  key={menu.tab}
                  onClick={() => handleNavigateToTab(menu.tab)}
                  className={`flex flex-col items-center gap-1.5 py-1 px-2.2 rounded-xl transition-all relative cursor-pointer ${
                    isActive 
                      ? "text-cyan-400 scale-105 font-semibold" 
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  <IconComp className={`w-4.5 h-4.5 ${isActive ? "stroke-[2.5]" : "stroke-2"}`} />
                  <span className="text-[8px] font-bold font-mono tracking-wide leading-none">{menu.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive floating chat mentor (Always ready!) */}
          <MentorBot activeCareerPath={activeCareerPath || undefined} />

          {/* Device indicator pill at bottom center */}
          {usePhoneFrame && (
            <div className="py-2.5 bg-[#0a0a0b] flex items-center justify-center shrink-0">
              <div className="w-28 h-1 bg-white/10 rounded-full" />
            </div>
          )}

        </div>
      </div>
      
      {/* Short instructions on how to test on small wrap frames */}
      <div className="absolute bottom-4 left-4 text-[10px] text-neutral-600 font-mono tracking-wide uppercase select-none xl:block hidden">
        Toggle modes on administrative panel above for web responsive sizing comparisons.
      </div>

    </div>
  );
}
