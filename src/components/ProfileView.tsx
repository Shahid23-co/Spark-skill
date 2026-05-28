import { useState } from "react";
import { 
  Trophy, BookOpen, Bookmark, LogIn, Award, Plus, Mail,
  CheckCircle, Shield, Briefcase, Camera, ExternalLink, RefreshCw, User
} from "lucide-react";
import { UserProfile, Course } from "../types";
import { SAMPLE_ACHIEVEMENTS, SAMPLE_COURSES } from "../data";
import { EmulatedDatabase, loginWithGoogleCloud, isFirebaseActive } from "../utils/firebaseFallback";
import { motion } from "motion/react";

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  onCourseSelect: (course: Course) => void;
  onSetAuthUser: (email: string, displayName: string) => void;
}

export default function ProfileView({
  profile,
  onUpdateProfile,
  onCourseSelect,
  onSetAuthUser,
}: ProfileViewProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authName, setAuthName] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"portfolio" | "achievements" | "saved">("portfolio");

  // Authentication simulation
  const handleAuthSubmit = (e: any) => {
    e.preventDefault();
    if (!authEmail.trim() || !authName.trim()) return;

    onSetAuthUser(authEmail, authName);
    setIsAuthModalOpen(false);
  };

  const handleSimulateGoogleLogin = async () => {
    if (isFirebaseActive) {
      const user = await loginWithGoogleCloud();
      if (user) {
        onSetAuthUser(user.email || "google.learner@gmail.com", user.displayName || "Sparky_Master");
      }
    } else {
      onSetAuthUser("google.learner@gmail.com", "Sparky_Master");
    }
    setIsAuthModalOpen(false);
  };

  const handleLevelName = (xp: number) => {
    const levelNumber = Math.floor(xp / 300) + 1;
    if (levelNumber >= 6) return "Master Hustler";
    if (levelNumber >= 3) return "Junior Spark";
    return "Skill Novice";
  };

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* Top Header Card */}
      <div className="relative overflow-hidden bg-[#0A0A0B] p-5.5 rounded-2xl border border-white/5 shadow-xl flex gap-4 items-center">
        <div className="w-16 h-16 rounded-full bg-[#050505] border-2 border-cyan-400 flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-cyan-500/15">
          {profile.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-cyan-400 font-display font-bold leading-none uppercase tracking-wider">
            {handleLevelName(profile.xp)}
          </p>
          <h2 className="text-base font-extrabold text-white mt-1.5 truncate font-display">{profile.displayName}</h2>
          <p className="text-[9px] text-[#A1A1A8] truncate mt-0.5">{profile.email}</p>
        </div>

        <button
          onClick={() => {
            setAuthEmail(profile.email || "");
            setAuthName(profile.displayName || "");
            setIsAuthModalOpen(true);
          }}
          className="px-3.5 py-2 bg-[#050505] hover:bg-white/5 text-neutral-350 rounded-xl transition-all cursor-pointer border border-white/10 text-[11px] font-bold"
        >
          {profile.email.includes("guest") ? "Register" : "Switch ID"}
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-3 gap-2.5 text-center leading-none uppercase font-mono font-bold text-[10px]">
        <div className="py-3.5 px-2 bg-[#0A0A0B] rounded-2xl border border-white/5 space-y-1.5 shadow-md">
          <span className="text-[9px] text-neutral-500 font-bold block">XP Earned</span>
          <span className="text-sm font-sans font-black text-white">{profile.xp}</span>
        </div>
        <div className="py-3.5 px-2 bg-[#0A0A0B] rounded-2xl border border-white/5 space-y-1.5 shadow-md">
          <span className="text-[9px] text-neutral-500 font-bold block">Unlocked</span>
          <span className="text-sm font-sans font-black text-cyan-400">{profile.completedLessons.length} Tasks</span>
        </div>
        <div className="py-3.5 px-2 bg-[#0A0A0B] rounded-2xl border border-white/5 space-y-1.5 shadow-md">
          <span className="text-[9px] text-neutral-500 font-bold block">Cash Class</span>
          <span className="text-sm font-sans font-black text-purple-400">{profile.completedCourses.length}</span>
        </div>
      </div>

      {/* Sub Tabs Toggle bar */}
      <div className="flex border-b border-[#1C1C1E]">
        {[
          { tab: "portfolio", name: "Designer Port" },
          { tab: "achievements", name: "Awards Rec" },
          { tab: "saved", name: "Saved Course" },
        ].map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveSubTab(item.tab as any)}
            className={`flex-1 pb-3 text-xs font-black transition-all border-b-2 text-center cursor-pointer font-display tracking-wide ${
              activeSubTab === item.tab
                ? "border-cyan-400 text-white"
                : "border-transparent text-neutral-400 hover:text-neutral-250"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Display Active Subtab */}
      <div className="space-y-4">
        {activeSubTab === "portfolio" && (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {profile.portfolio && profile.portfolio.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#0A0A0B] rounded-2xl overflow-hidden border border-white/5 flex flex-col group shadow-lg"
              >
                <div className="relative aspect-video bg-[#050505] overflow-hidden">
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-2.5 flex justify-between items-center bg-[#050505]/40 border-t border-white/5">
                  <span className="text-[10px] text-white font-semibold truncate max-w-[80%]">{item.title}</span>
                  <span className="text-[9px] text-cyan-400 font-mono flex items-center gap-0.5 shrink-0 font-bold">
                    ❤️ {item.likes || 0}
                  </span>
                </div>
              </div>
            ))}

            {(!profile.portfolio || profile.portfolio.length === 0) && (
              <div className="col-span-2 text-center py-10 bg-[#0A0A0B]/30 rounded-2xl border border-dashed border-[#1C1C1E]">
                <Camera className="w-10 h-10 text-neutral-700 mx-auto mb-2" />
                <p className="text-xs text-neutral-500 font-sans">Your design portfolio is currently empty. Go to Showcase tab to post!</p>
              </div>
            )}
          </div>
        )}

        {activeSubTab === "achievements" && (
          <div className="space-y-2.5 pb-4">
            {SAMPLE_ACHIEVEMENTS.map((ach) => {
              const isUnlocked = profile.unlockedAchievements.includes(ach.id) || profile.xp >= ach.xpRequired;

              return (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                    isUnlocked
                      ? "bg-[#0A0A0B] border-cyan-400/20 text-white shadow-lg"
                      : "bg-[#0A0A0B]/40 border-white/5 opacity-55"
                  }`}
                >
                  <span className="text-2xl shrink-0 p-2 bg-[#050505] rounded-xl border border-white/5">{ach.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-bold font-display">{ach.title}</h4>
                      {isUnlocked && (
                        <span className="bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-lg uppercase">
                          UNLOCKED
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-450 leading-normal mt-1 pr-1">{ach.desc}</p>
                    <p className="text-[9px] text-[#A1A1A8] font-mono mt-1.5">Requires: {ach.xpRequired} XP total</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeSubTab === "saved" && (
          <div className="space-y-2.5 pb-4">
            {SAMPLE_COURSES.filter((c) => profile.savedCourses.includes(c.id)).map((course) => (
              <div
                key={course.id}
                onClick={() => onCourseSelect(course)}
                className="bg-[#0A0A0B] border border-white/5 p-2.5 rounded-2xl cursor-pointer hover:border-cyan-400/20 transition-all flex gap-3 items-center shadow-lg"
              >
                <img src={course.image} alt="" className="w-11 h-11 rounded-xl object-cover border border-white/5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] bg-cyan-400/10 border border-cyan-400/25 px-1.5 py-0.5 rounded text-cyan-300 font-mono font-bold uppercase shrink-0 leading-none">
                    {course.category}
                  </span>
                  <h4 className="text-xs font-semibold text-white truncate mt-1.5 font-display">{course.title}</h4>
                </div>
                <button
                  type="button"
                  className="p-1 px-3 bg-[#050505] text-cyan-400 text-[10px] font-bold rounded-xl border border-white/10 cursor-pointer hover:bg-neutral-900 transition-colors shrink-0"
                >
                  Learn
                </button>
              </div>
            ))}

            {SAMPLE_COURSES.filter((c) => profile.savedCourses.includes(c.id)).length === 0 && (
              <div className="text-center py-10 bg-[#0A0A0B]/30 rounded-2xl border border-dashed border-[#1C1C1E]">
                <Bookmark className="w-10 h-10 text-neutral-700 mx-auto mb-2" />
                <p className="text-xs text-neutral-550 font-sans">Your bookmark catalog is currently empty.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Authentication Simulation Modal Block */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAuthSubmit}
            className="bg-[#0A0A0B] border border-white/10 w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
              <h3 className="font-bold text-white text-sm font-display">Sign in / Register Profile</h3>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="p-1 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Google simulation */}
            <button
              type="button"
              onClick={handleSimulateGoogleLogin}
              className="w-full py-3 bg-[#050505] hover:bg-white/5 text-neutral-200 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 border border-white/10 cursor-pointer whitespace-nowrap transition-colors"
            >
              <GoogleSvgIcon /> Continu with Google Accounts
            </button>

            <div className="text-center text-neutral-500 text-[10px] font-mono leading-none tracking-wider uppercase py-1">
              - OR USE EMAIL REGISTER -
            </div>

            {/* Email Form fields */}
            <div className="space-y-1.5 text-xs">
              <label className="text-neutral-400 font-semibold font-mono uppercase tracking-wider text-[9px]">Select Display Nickname</label>
              <input
                type="text"
                placeholder="e.g. CapCutRuler"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                required
                className="w-full bg-[#050505] p-3 rounded-xl border border-white/5 focus:outline-none focus:border-cyan-400 text-white transition-all font-sans"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-neutral-400 font-semibold font-mono uppercase tracking-wider text-[9px]">Student Email Address</label>
              <input
                type="email"
                placeholder="e.g. student@skillspark.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                required
                className="w-full bg-[#050505] p-3 rounded-xl border border-white/5 focus:outline-none focus:border-cyan-400 text-white transition-all font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-purple-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/25 cursor-pointer font-display"
            >
              ✓ Complete Registration
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// Google SVG icon helper
function GoogleSvgIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
