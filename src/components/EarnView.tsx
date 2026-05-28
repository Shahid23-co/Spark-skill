import { useState, useEffect } from "react";
import { 
  Briefcase, Coins, CheckCircle, Clock, FileText, Send, 
  Sparkles, Award, PlayCircle, Star, ArrowRight, ShieldCheck, 
  HelpCircle, Archive, AlertCircle, Info, FileEdit
} from "lucide-react";
import { Gig, UserProfile, Challenge } from "../types";
import { SAMPLE_GIGS } from "../data";
import { EmulatedDatabase } from "../utils/firebaseFallback";
import { motion, AnimatePresence } from "motion/react";

interface EarnViewProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  onCompleteChallengeAction: (actionType: string) => void;
}

export default function EarnView({
  profile,
  onUpdateProfile,
  onCompleteChallengeAction,
}: EarnViewProps) {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [activeGig, setActiveGig] = useState<Gig | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [mockFileCategory, setMockFileCategory] = useState("MP4 Video Delivery");
  const [coinsBalance, setCoinsBalance] = useState(150); // Starting default

  // Sync Gigs and Balance
  useEffect(() => {
    const handleSync = () => {
      const savedGigs = EmulatedDatabase.getGigs();
      if (savedGigs.length === 0) {
        EmulatedDatabase.saveGigs(SAMPLE_GIGS);
        setGigs(SAMPLE_GIGS);
      } else {
        setGigs(savedGigs);
      }
    };

    handleSync();
    window.addEventListener("skillspark_gigs_updated", handleSync);
    return () => window.removeEventListener("skillspark_gigs_updated", handleSync);
  }, []);

  const handleClaimGig = (gigId: string) => {
    const updated = gigs.map((gig) => {
      if (gig.id === gigId) {
        return { ...gig, status: "in_progress" as const, assignedTo: profile.userId };
      }
      return gig;
    });

    setGigs(updated);
    EmulatedDatabase.saveGigs(updated);
    
    // Update currently viewed gig state
    const found = updated.find((g) => g.id === gigId);
    if (found) {
      setActiveGig(found);
    }
  };

  const handleSubmitDeliverable = (gig: Gig) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);

    // Simulated short client evaluation phase
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reward points, balance, and complete gig!
      const updated = gigs.map((g) => {
        if (g.id === gig.id) {
          return { ...g, status: "completed" as const };
        }
        return g;
      });

      setGigs(updated);
      EmulatedDatabase.saveGigs(updated);

      // Add Coins Balance & Award XP!
      const coinReward = gig.payment;
      const xpReward = 150;
      setCoinsBalance((prev) => prev + coinReward);

      const isFirstGig = !profile.unlockedAchievements.includes("gig-completed");
      const updatedAchievements = isFirstGig 
        ? [...profile.unlockedAchievements, "gig-completed"] 
        : profile.unlockedAchievements;

      onUpdateProfile({
        ...profile,
        xp: profile.xp + xpReward,
        unlockedAchievements: updatedAchievements
      });

      // Daily/weekly mission tick
      onCompleteChallengeAction("claim_gig");

      // Auto clear active gig after a delay
      setTimeout(() => {
        setActiveGig(null);
        setSubmitSuccess(false);
      }, 3000);

    }, 3500);
  };

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* Header Panel */}
      <div className="flex justify-between items-center bg-[#0A0A0B] p-4.5 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight font-display">Earn Zone</h1>
          <p className="text-xs text-neutral-400 mt-0.5 font-sans">Claim micro-gigs, complete client specs, and withdraw coins.</p>
        </div>

        <div className="bg-yellow-400/10 border border-yellow-400/30 px-3.5 py-2.5 rounded-2xl text-center shrink-0">
          <div className="flex items-center gap-1.5 text-yellow-400 justify-center">
            <Coins className="w-4 h-4 fill-yellow-500 animate-spin" />
            <span className="font-sans font-black text-sm">{coinsBalance}</span>
          </div>
          <p className="text-[8px] text-neutral-500 uppercase tracking-widest font-mono font-bold mt-0.5">SPARK COINS</p>
        </div>
      </div>

      {/* Guild Safety guidelines Card */}
      <div className="p-3.5 bg-[#050505] rounded-2xl border border-cyan-500/15 flex gap-2.5 items-center">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
        <p className="text-[10px] text-neutral-400 leading-normal font-sans">
          <strong className="text-white">Teen Guard Active:</strong> Every client brief is filtered by SkillSpark advisors to assure seamless payout releases.
        </p>
      </div>

      {/* Main Tabs */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Open Freelance briefs</h3>

        <div className="space-y-4">
          {gigs.map((gig) => {
            const isClaimedByMe = gig.status === "in_progress" && gig.assignedTo === profile.userId;
            const isCompleted = gig.status === "completed";

            return (
              <div
                key={gig.id}
                onClick={() => setActiveGig(gig)}
                className="bg-[#0A0A0B] border border-white/5 hover:border-cyan-500/20 rounded-2xl p-4.5 cursor-pointer transition-all flex flex-col justify-between shadow-lg"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] text-cyan-300 font-mono font-bold uppercase tracking-wider bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/15">
                      {gig.category}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-2 leading-snug font-display">{gig.title}</h4>
                    <p className="text-[10px] text-neutral-400 font-mono mt-1">Client: {gig.clientName}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-black text-cyan-400 flex items-center gap-1 justify-end font-display">
                      <Coins className="w-3.5 h-3.5 fill-cyan-400/20 text-cyan-400" />
                      <span>{gig.payment} Coins</span>
                    </div>
                    <span className={`text-[8px] font-mono font-black uppercase tracking-wider px-2 py-1 rounded-lg block mt-1.5 ${
                      isCompleted 
                        ? "bg-purple-900/10 text-purple-400 border border-purple-500/20" 
                        : isClaimedByMe 
                        ? "bg-yellow-400/10 text-yellow-400 border border-yellow-500/20 animate-pulse" 
                        : "bg-white/5 text-neutral-400 border border-white/5"
                    }`}>
                      {isCompleted ? "COMPLETED" : isClaimedByMe ? "IN PROGRESS" : "OPEN"}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-[#A3A3AC] line-clamp-2 mt-3 leading-relaxed font-sans">
                  {gig.description}
                </p>

                <div className="mt-4 pt-3.5 border-t border-white/5 flex justify-between items-center text-[10px] text-neutral-500">
                  <span className="font-mono">Difficulty: {gig.difficulty}</span>
                  <div className="flex items-center gap-1.5 text-cyan-455 text-cyan-400 font-extrabold font-mono uppercase tracking-wider">
                    Details <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gig Application Drawer / Submitting Portal overlay */}
      <AnimatePresence>
        {activeGig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-[#0A0A0B] border border-white/10 w-full max-w-sm rounded-3xl overflow-hidden flex flex-col p-5 space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-start border-b border-white/5 pb-2.5">
                <div>
                  <span className="text-[8px] bg-cyan-400/10 text-cyan-300 font-mono font-bold px-1.5 py-0.5 rounded border border-cyan-400/15 uppercase">
                    {activeGig.category}
                  </span>
                  <h3 className="font-bold text-white text-xs mt-1.5 font-display">{activeGig.title}</h3>
                </div>
                <button
                  onClick={() => setActiveGig(null)}
                  disabled={isSubmitting}
                  className="p-1 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Loader screen for evaluation */}
              {isSubmitting ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-11 h-11 bg-cyan-400/10 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-cyan-400 animate-spin" />
                  <div>
                    <h4 className="text-xs font-bold text-white font-display">Advising Client Review...</h4>
                    <p className="text-[9px] text-neutral-400 font-mono mt-0.5">Evaluating your template, contrast formats, and overlays...</p>
                  </div>
                </div>
              ) : submitSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/25">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cyan-400 font-display">GIG COMPLETED & SIGNED!</h4>
                    <p className="text-[10px] text-white font-semibold mt-1 font-display">+{activeGig.payment} Spark Coins Released</p>
                    <p className="text-[9px] text-neutral-400 font-mono mt-1">+150 XP credited to Rank profile</p>
                  </div>
                </div>
              ) : (
                // Interactive Claim/Submit Panels
                <div className="space-y-4 text-xs font-sans">
                  <div className="space-y-1.5 bg-[#050505] p-3.5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-neutral-400 font-mono uppercase tracking-wider block">Brief Guidelines</span>
                    <p className="text-[10px] text-neutral-300 leading-normal">{activeGig.description}</p>
                  </div>

                  <div className="flex justify-between text-[10px] font-mono leading-none border-y border-white/5 py-3.5 text-neutral-400">
                    <span>Payment: <strong className="text-white">{activeGig.payment} coins</strong></span>
                    <span>Client: <strong className="text-white">{activeGig.clientName}</strong></span>
                  </div>

                  {/* Dynamic Action Buttons */}
                  {activeGig.status === "open" ? (
                    <button
                      onClick={() => handleClaimGig(activeGig.id)}
                      className="w-full py-3 bg-gradient-to-r from-cyan-400 to-purple-600 text-white font-extrabold rounded-xl transition-all shadow-lg shadow-cyan-500/25 cursor-pointer font-display text-center"
                    >
                      🚀 Claim open Gig & Start Work
                    </button>
                  ) : activeGig.status === "in_progress" && activeGig.assignedTo === profile.userId ? (
                    <div className="space-y-3 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-neutral-450 font-mono uppercase tracking-wider block">
                          Inject Submission File Deliverable
                        </label>
                        <select 
                          value={mockFileCategory}
                          onChange={(e) => setMockFileCategory(e.target.value)}
                          className="w-full bg-[#050505] p-3 text-[11px] border border-white/5 focus:outline-none focus:border-cyan-400 rounded-xl text-neutral-200 transition-colors cursor-pointer"
                        >
                          <option>MP4 Video Delivery (Reels Export)</option>
                          <option>Figma Prototype Board Source</option>
                          <option>PNG High-CTR JPG Thumbnail Cover</option>
                          <option>React TS Pricing Applet bundle</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleSubmitDeliverable(activeGig)}
                        className="w-full py-3 bg-gradient-to-r from-cyan-400 to-purple-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 cursor-pointer text-center flex items-center justify-center gap-1.5 font-display"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit Work to Client Box
                      </button>
                    </div>
                  ) : (
                    // Completed or assigned to someone else
                    <div className="p-3.5 bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 text-center font-bold text-xs rounded-xl font-display">
                      ✓ Deliverable signed off by client!
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple internal icon helper for compactness
function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  );
}
