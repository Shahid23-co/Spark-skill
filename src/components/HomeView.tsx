import { useState, useRef, useEffect } from "react";
import { Sparkles, Trophy, PlayCircle, Zap, Flame, Award, ChevronRight, TrendingUp, Play, Pause, HelpCircle, Video, Compass, Briefcase, Camera, Volume2, VolumeX, CheckCircle, Info } from "lucide-react";
import { Course, Challenge, UserProfile } from "../types";
import { SAMPLE_COURSES } from "../data";
import { motion, AnimatePresence } from "motion/react";

const TUTORIAL_CHAPTERS = [
  {
    title: "1. Create AI Pathway",
    tab: "guide",
    badge: "🧠 Zara AI Advisor",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-video-editing-timeline-on-computer-screen-40502-large.mp4",
    tip: "Write a high-concept interest (e.g. 'YouTube shorts creator') inside the input box, click Consult, and Zara AI will automatically build your customized skill tree with est. income metrics!",
    narrator: "Zara AI",
    subtitles: "Welcome! To begin your career, click the AI Guide tab. Enter your core artistic passions to render a personalized multi-stage path with calculated milestone tasks.",
    features: ["Custom skill trees built by Gemini", "Calculate estimated salary yields", "Activate active pathways to update tasks"]
  },
  {
    title: "2. Watch micro-courses",
    tab: "learn",
    badge: "🎬 Stream Hub",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-typing-on-laptop-keyboard-close-up-43093-large.mp4",
    tip: "Choose customized free miniature courses in Editing, YouTube Growth, coding, or Thumbnails. Click 'Watch & Study' to stream high-quality tutorial chapters and claim instant rank XP!",
    narrator: "Mentor Max",
    subtitles: "Browse bite-sized masterclasses under the Learn tab. Watch short visual chapters on timeline cuts, retention tactics, or code files, and hit 'Mark Lesson Complete' to level up.",
    features: ["Bite-sized mobile videos & overlays", "Study CapCut tricks, Algorithm rules & Figma setups", "Accumulate levels to qualify for micro-gigs"]
  },
  {
    title: "3. Publish Portfolio",
    tab: "community",
    badge: "🎨 Creative Showcase",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-smartphone-with-social-media-feed-41551-large.mp4",
    tip: "Post thumbnails, video designs, or template codes on the feed. Receive instant feedback comments, build your public profile portfolios, and claim daily level achievements!",
    narrator: "Elena Designer",
    subtitles: "Share your practice creations directly on the Showcase Feed! Get Likes and creative advice critiques from student peers, which automatically updates your profile portfolio panel.",
    features: ["Pre-designed mock templates ready to publish", "Receive feedback and direct critiques from other creators", "Showcase designs render beautifully under your ID Card"]
  },
  {
    title: "4. Claim Freelance Jobs",
    tab: "earn",
    badge: "💼 Coins Guild",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sound-wave-on-an-audio-mixer-42352-large.mp4",
    tip: "Open real client briefs, claim open gigs, drop your simulated outcome file deliverables, and withdraw real Spark Coins balance directly into your digital student wallet!",
    narrator: "Client Support",
    subtitles: "Ready to make real cash? Under the Earn tab, claim active client specs. Upload your final project deliverables, bypass advisors safely, and cash out Spark Coins instantly.",
    features: ["Micro-gig briefs vetted for safety & high speed payouts", "Submit real design/marketing briefs through selective mock categories", "Claim Spark Coins upon automatic verification"]
  }
];

interface HomeViewProps {
  profile: UserProfile;
  challenges: Challenge[];
  onCourseSelect: (course: Course) => void;
  onNavigate: (tab: string) => void;
  onToggleChallenge: (id: string) => void;
}

export default function HomeView({
  profile,
  challenges,
  onCourseSelect,
  onNavigate,
  onToggleChallenge,
}: HomeViewProps) {
  const isLessonCompleted = (lessonId: string) => profile.completedLessons.includes(lessonId);

  // Walkthrough states
  const [activeChapter, setActiveChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentChapterData = TUTORIAL_CHAPTERS[activeChapter];

  // Auto-play action helper is activated when activeChapter updates
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log("Auto-play blocked or queued. Switched to manual state.", err);
          });
        }
      }
    }
  }, [activeChapter]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Derive courses currently in progress
  const inProgressCourses = SAMPLE_COURSES.filter(course => {
    const hasStarted = course.lessons.some(l => isLessonCompleted(l.id));
    const isFinished = profile.completedCourses.includes(course.id);
    return hasStarted && !isFinished;
  });

  // Calculate current level threshold
  const levelNumber = Math.floor(profile.xp / 300) + 1;
  const levelProgressXp = profile.xp % 300;
  const progressPercent = Math.min((levelProgressXp / 300) * 100, 100);

  // Recommendations: suggest courses by matching preferred categories
  const aiRecommended = SAMPLE_COURSES.filter(c => !profile.completedCourses.includes(c.id)).slice(0, 2);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner (Motivational & Sleek Profile Header) */}
      <div className="flex justify-between items-center bg-[#0A0A0B] p-4.5 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">Good Day, Creator</p>
          <div className="flex items-center gap-2 mt-0.5">
            <h1 className="text-base font-black text-white tracking-tight font-display">{profile.displayName}</h1>
            <span className="bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 text-[9px] px-1.5 py-0.5 rounded-lg font-mono font-bold leading-none">
              LVL {levelNumber}
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-sm font-bold text-yellow-400">
              <Flame className="w-4 h-4 fill-yellow-500 stroke-yellow-500 animate-pulse" />
              <span className="font-display font-bold">4D Streak</span>
            </div>
            <p className="text-[9px] text-neutral-500 font-mono font-semibold">150 Spark Coins</p>
          </div>
          <span className="text-2xl filter drop-shadow-md">{profile.avatar}</span>
        </div>
      </div>

      {/* Hero Banner card - High Visual Contrast Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-3xl border border-white/15 shadow-xl shadow-sleek-purple">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl font-display" />
        <div className="relative z-10 max-w-[85%] space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
            ✨ MASTER CLASS ASSIGNMENT
          </p>
          <h2 className="text-lg font-bold text-white leading-tight tracking-tight font-display">
            Edit 30s Viral Short Film & Earn Weekly Rewards
          </h2>
          <p className="text-[11px] text-purple-100 mt-1 leading-relaxed opacity-90">
            Gain video editing, high-CTR thumbnail skills, and unlock real cash client assignments.
          </p>
          <button
            onClick={() => onNavigate("guide")}
            className="mt-4 px-4 py-2 bg-white text-purple-700 text-xs font-bold rounded-full hover:bg-neutral-100 transition-all flex items-center gap-1 cursor-pointer font-display"
          >
            Generate Career Roadmap <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Step-by-Step App Walkthrough Tutorial featuring live chapters */}
      <div className="bg-[#0A0A0B] border border-white/5 p-5 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
        {/* Glow backdrop decorative */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="p-1 px-2.5 bg-cyan-400/15 border border-cyan-400/25 text-[8px] text-cyan-300 rounded-full font-mono uppercase tracking-wider font-extrabold">
                Academy Walkthrough
              </span>
              <span className="flex items-center gap-1 text-[10px] text-[#A1A1A8] font-semibold font-mono">
                <Video className="w-3 h-3 text-cyan-400" /> Walkthrough Guide
              </span>
            </div>
            <h3 className="text-sm font-black text-white mt-1.5 tracking-tight font-display">
              Step-by-Step App Tutorial (Hindi/English Guide)
            </h3>
            <p className="text-[10px] text-neutral-400 leading-snug">
              Learn how to build AI paths, watch micro-classes, and withdraw real Coins easily!
            </p>
          </div>
          <HelpCircle className="w-5 h-5 text-neutral-500 hover:text-cyan-400 transition-colors shrink-0" />
        </div>

        {/* Dynamic Video Player Frame */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Visual Player container */}
          <div className="md:col-span-7 space-y-2.5">
            <div className="relative aspect-video rounded-2xl bg-black border border-white/10 overflow-hidden shadow-inner group">
              <video
                ref={videoRef}
                className="w-full h-full object-cover transition-all"
                src={currentChapterData.videoUrl}
                playsInline
                muted={isMuted}
                autoPlay={isPlaying}
                loop
              />

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Live Status indicator */}
              <div className="absolute top-3 left-3 bg-red-500/80 backdrop-blur-md text-[8px] text-white font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10 shadow-lg">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Live Walkthrough
              </div>

              {/* Active Chapter Label overlay */}
              <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-[8.5px] text-cyan-400 font-mono font-bold px-2 py-0.5 rounded-md border border-white/5">
                {currentChapterData.badge}
              </div>

              {/* Video control hot-bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 bg-black/75 hover:bg-black text-white rounded-lg transition-all cursor-pointer border border-white/5 hover:scale-105 active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-1.5 bg-black/75 hover:bg-black text-white rounded-lg transition-all cursor-pointer border border-white/5 hover:scale-105 active:scale-95"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-neutral-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
                  </button>
                </div>

                <div className="text-[8.5px] font-mono text-neutral-300 uppercase tracking-wider font-bold bg-neutral-950/80 px-2 py-1 rounded-md border border-white/5 shrink-0 select-none">
                  Speaker: {currentChapterData.narrator}
                </div>
              </div>
            </div>

            {/* Active Subtitle Script Box */}
            <div className="bg-[#050505] p-3 rounded-2xl border border-white/5 flex gap-2.5 items-start">
              <span className="text-base leading-none bg-cyan-400/10 p-1.5 rounded-lg border border-cyan-400/20 shrink-0">🤖</span>
              <div className="space-y-0.5">
                <span className="text-[8.5px] text-cyan-300 font-mono font-extrabold uppercase block tracking-wider">
                  Script Caption (Hindi Guide)
                </span>
                <p className="text-[10px] text-neutral-200 leading-normal font-sans">
                  "{currentChapterData.subtitles}" <span className="text-[#8E8E93] block mt-1">💡 <strong className="text-cyan-300">Tip:</strong> Users simply click the button on the right to navigate step-by-step or toggle different steps.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Chapter Selections and Walkthrough Bullet Specifications */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-3">
            {/* Step Selection Grid */}
            <div className="space-y-1.5">
              <span className="text-[8.5px] text-[#8E8E93] font-bold font-mono uppercase tracking-widest block">
                Guide Chapters
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {TUTORIAL_CHAPTERS.map((chap, idx) => {
                  const isActive = idx === activeChapter;
                  return (
                    <button
                      key={chap.title}
                      onClick={() => setActiveChapter(idx)}
                      className={`p-2.5 rounded-xl text-left border flex flex-col justify-between transition-all cursor-pointer ${
                        isActive
                          ? "bg-cyan-400/10 border-cyan-400/40 shadow-inner"
                          : "bg-[#050505] border-white/5 hover:border-white/10"
                      }`}
                    >
                      <span className={`text-[9px] font-bold block ${isActive ? "text-cyan-300 font-mono" : "text-[#8E8E93] font-mono"}`}>
                        Step {idx + 1}
                      </span>
                      <span className="text-[9.5px] font-extrabold text-white truncate font-display tracking-tight leading-none mt-1">
                        {chap.title.split(". ")[1]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Specifications Details */}
            <div className="bg-[#050505] border border-white/5 p-3 rounded-2xl flex-1 flex flex-col justify-between space-y-2">
              <div className="space-y-1.5">
                <span className="text-[9px] text-[#8E8E93] font-extrabold font-mono uppercase block tracking-wider">
                  CHAPTER INSTRUCTIONS
                </span>
                <p className="text-[10px] text-neutral-300 font-sans leading-normal leading-relaxed">
                  {currentChapterData.tip}
                </p>
                <div className="space-y-1 pt-1">
                  {currentChapterData.features.map((feat, fidx) => (
                    <div key={fidx} className="flex gap-1.5 items-center text-[9px] text-cyan-400">
                      <CheckCircle className="w-3 h-3 text-[#22D3EE] shrink-0" />
                      <span className="text-[#A1A1A8] font-medium font-sans">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to action navigation trigger button */}
              <button
                onClick={() => onNavigate(currentChapterData.tab)}
                className="w-full py-2 bg-gradient-to-r from-cyan-400 to-purple-600 hover:opacity-95 text-white text-[9.5px] font-black rounded-lg shadow-lg shadow-cyan-500/15 transition-all flex items-center justify-center gap-1 cursor-pointer font-display"
              >
                🚀 Try This Step Now <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Level progression meter */}
      <div className="bg-[#0A0A0B] border border-white/5 p-4.5 rounded-2xl space-y-2.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-neutral-300 font-bold font-display">Rank Progression</span>
          <span className="font-mono text-neutral-400 text-[10px] font-semibold">
            {levelProgressXp}/300 XP to Lvl {levelNumber + 1}
          </span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
          />
        </div>
      </div>

      {/* Continue Learning in-progress section */}
      {inProgressCourses.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Continue Hustling</h3>
          <div className="space-y-2">
            {inProgressCourses.map((course) => {
              const completedCount = course.lessons.filter(l => isLessonCompleted(l.id)).length;
              const ratio = Math.round((completedCount / course.lessons.length) * 100);

              return (
                <div
                  key={course.id}
                  onClick={() => onCourseSelect(course)}
                  className="bg-[#0A0A0B] border border-white/5 p-3 rounded-2xl hover:border-cyan-500/20 cursor-pointer flex gap-3 items-center transition-all shadow-sm"
                >
                  <img src={course.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider font-mono">{course.category}</p>
                    <h4 className="text-xs font-bold text-white truncate mt-0.5">{course.title}</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400" style={{ width: `${ratio}%` }} />
                      </div>
                      <span className="text-[9px] text-neutral-500 font-mono font-bold">{ratio}%</span>
                    </div>
                  </div>
                  <PlayCircle className="w-6 h-6 text-cyan-400 sm:hover:text-cyan-300 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Challenges System widget */}
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Daily Missions</h3>
          <span className="text-[9px] text-cyan-400 font-mono font-bold flex items-center gap-0.5 bg-cyan-400/10 px-2 py-0.5 rounded-lg border border-cyan-400/20">
            🕒 Reset in 8h
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {challenges.filter(c => c.type === "daily").map((challenge) => (
            <div
              key={challenge.id}
              onClick={() => onToggleChallenge(challenge.id)}
              className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                challenge.isCompleted
                  ? "bg-[#050505]/40 border-cyan-500/10 opacity-50 line-through text-neutral-500"
                  : "bg-[#0A0A0B] border-white/5 hover:border-cyan-500/20 shadow-sm"
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${challenge.isCompleted ? "bg-neutral-900 text-neutral-600" : "bg-gradient-to-br from-cyan-400/10 to-purple-600/10 text-cyan-400 border border-white/5"}`}>
                <Trophy className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-xs font-bold font-display ${challenge.isCompleted ? "text-neutral-500" : "text-white"}`}>
                  {challenge.title}
                </h4>
                <p className="text-[10px] text-neutral-400 truncate mt-0.5">{challenge.description}</p>
              </div>
              <span className={`text-[10px] font-bold font-mono px-2 py-1 rounded-lg shrink-0 ${
                challenge.isCompleted ? "bg-neutral-900 text-neutral-600" : "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20"
              }`}>
                +{challenge.xpReward} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Personalized courses */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            AI Highlights <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20 animate-pulse" />
          </h3>
          <button onClick={() => onNavigate("learn")} className="text-[10px] text-cyan-400 hover:underline cursor-pointer font-bold font-mono">
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {aiRecommended.map((course) => (
            <div
              key={course.id}
              onClick={() => onCourseSelect(course)}
              className="bg-[#0A0A0B] border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/20 transition-all cursor-pointer flex flex-col h-full shadow-sm"
            >
              <div className="relative h-24">
                <img src={course.image} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-neutral-950/80 backdrop-blur-md text-[9px] text-cyan-300 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                  {course.category}
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug font-display">{course.title}</h4>
                  <p className="text-[9px] text-neutral-400 mt-1 font-mono font-semibold">By {course.mentor}</p>
                </div>
                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-white/5">
                  <span className="text-[9px] font-bold text-yellow-400 font-mono flex items-center">⭐ {course.rating}</span>
                  <span className="text-[10px] font-bold text-cyan-400 font-mono">+{course.xpReward} XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending channels highlight section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          Trending Skillsets <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {["Video Editing", "Coding", "Thumbnails"].map((tag, idx) => (
            <div
              key={idx}
              className="p-2.5 bg-gradient-to-b from-[#0A0A0B] to-[#050505] border border-white/5 rounded-2xl text-center cursor-pointer hover:border-cyan-500/20 hover:scale-[1.02] transition-all shadow-sm"
              onClick={() => onNavigate("learn")}
            >
              <span className="text-[10px] font-bold text-neutral-200">{tag}</span>
              <p className="text-[8px] text-cyan-400 font-mono mt-0.5 font-bold uppercase tracking-wider">Hot • +40%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
