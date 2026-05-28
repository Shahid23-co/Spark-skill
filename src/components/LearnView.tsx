import { useState, useEffect, useRef } from "react";
import { Course, Lesson, UserProfile, Challenge } from "../types";
import { 
  Play, Pause, BookOpen, Clock, Heart, ArrowLeft, CheckCircle, 
  Search, Bookmark, Sparkles, Award, Star, Volume2, ShieldAlert,
  Maximize2, Plus, Download, Subtitles, HelpCircle, FileText, 
  MessageSquare, Send, ChevronRight, ChevronDown, Cpu, UploadCloud, 
  X, Check, Flame, Share2, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ENHANCED_COURSES, ENHANCED_INSTRUCTORS, 
  EnhancedCourse, EnhancedLesson, EnhancedInstructor, 
  TimelineTrigger, SubtitleCue, PracticeAssignment 
} from "../learningData";

const formatTime = (secs: number): string => {
  if (isNaN(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const getYoutubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

interface LearnViewProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  selectedCourseFromOutside: Course | null;
  onClearOutsideCourse: () => void;
  challenges: Challenge[];
  onCompleteChallengeAction: (actionType: string) => void;
}

const CATEGORIES = [
  "All",
  "Video Editing",
  "YouTube Growth",
  "AI Tools",
  "Thumbnail Design",
];

export default function LearnView({
  profile,
  onUpdateProfile,
  selectedCourseFromOutside,
  onClearOutsideCourse,
  onCompleteChallengeAction,
}: LearnViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Navigation states
  const [activeCourse, setActiveCourse] = useState<EnhancedCourse | null>(null);
  const [activeLesson, setActiveLesson] = useState<EnhancedLesson | null>(null);
  const [activeTab, setActiveTab2] = useState<"index" | "notes" | "resources" | "discussion">("index");
  
  // Custom video playback states
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [captionLanguage, setCaptionLanguage] = useState<"en" | "hi" | "none">("en");
  
  // Custom interactive features states
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [offlineLessons, setOfflineLessons] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState("");
  const [notesList, setNotesList] = useState<Array<{ id: string; time: number; text: string; date: string }>>([]);
  const [commentsList, setCommentsList] = useState<Array<{ id: string; author: string; avatar: string; text: string; time: string; isMentor?: boolean }>>([]);
  const [userComment, setUserComment] = useState("");
  const [isMentorReplying, setIsMentorReplying] = useState(false);

  // Practice module states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mockFileName, setMockFileName] = useState("");
  const [practiceXPAward, setPracticeXPAward] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isScanningPractice, setIsScanningPractice] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanReport, setScanReport] = useState<{
    score: number;
    feedback: string;
    checklistPassed: boolean[];
    xpGained: number;
    coinsGained: number;
  } | null>(null);

  // Creator Teacher states
  const [followedInstructors, setFollowedInstructors] = useState<string[]>([]);
  const [isLiveRoomOpen, setIsLiveRoomOpen] = useState(false);
  const [activeLiveInstructor, setActiveLiveInstructor] = useState<EnhancedInstructor | null>(null);
  const [liveMessages, setLiveMessages] = useState<Array<{ author: string; avatar: string; text: string }>>([
    { author: "RahulS", avatar: "🛹", text: "Is this stream recorded? Max's splitting strategy is pure fire." },
    { author: "SnehaED", avatar: "✨", text: "how to adjust voice ducking in capcut automatically?" },
    { author: "Preet", avatar: "🔥", text: "Finally learning actual professional workflow here, loving it!" }
  ]);
  const [liveUserMsg, setLiveUserMsg] = useState("");

  const [completionAlert, setCompletionAlert] = useState<{ text: string; xp: number } | null>(null);
  const [autoNextCounter, setAutoNextCounter] = useState<number | null>(null);

  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const ytPlayerRef = useRef<any>(null);

  // Map Selected Course from home screen safely
  useEffect(() => {
    if (selectedCourseFromOutside) {
      let linkedCourse = ENHANCED_COURSES.find(c => c.id === selectedCourseFromOutside.id);
      if (!linkedCourse) {
        // Fallback or rename search helper
        if (selectedCourseFromOutside.id === "course-1") {
          linkedCourse = ENHANCED_COURSES.find(c => c.id === "course-capcut");
        } else if (selectedCourseFromOutside.id === "course-2") {
          linkedCourse = ENHANCED_COURSES.find(c => c.id === "course-shorts");
        } else if (selectedCourseFromOutside.id === "course-3") {
          linkedCourse = ENHANCED_COURSES.find(c => c.id === "course-ai-tools");
        } else if (selectedCourseFromOutside.id === "course-4") {
          linkedCourse = ENHANCED_COURSES.find(c => c.id === "course-thumbnail");
        } else if (selectedCourseFromOutside.id === "course-5") {
          linkedCourse = ENHANCED_COURSES.find(c => c.id === "course-mobile-cinematic");
        } else {
          linkedCourse = ENHANCED_COURSES[0];
        }
      }

      if (linkedCourse) {
        setActiveCourse(linkedCourse);
        // Load first uncompleted lesson
        const uncompleted = linkedCourse.lessons.find(
          (l) => !profile.completedLessons.includes(l.id)
        );
        handleLessonSelect(uncompleted || linkedCourse.lessons[0], linkedCourse);
      }
      onClearOutsideCourse();
    }
  }, [selectedCourseFromOutside]);

  // Handle lesson select & sync features
  const handleLessonSelect = (lesson: EnhancedLesson, course: EnhancedCourse) => {
    setActiveLesson(lesson);
    setIsVideoPlaying(false);
    setAutoNextCounter(null);
    setScanReport(null);
    setUploadedFile(null);
    setMockFileName("");
    
    // Load local notes
    const savedNotes = localStorage.getItem(`notes_${lesson.id}`);
    if (savedNotes) {
      try { setNotesList(JSON.parse(savedNotes)); } catch(e) { setNotesList([]); }
    } else {
      setNotesList([]);
    }

    // Load initial discussions
    const mentor = ENHANCED_INSTRUCTORS[course.mentorName] || Object.values(ENHANCED_INSTRUCTORS)[0];
    const initialDiscussions = [
      { id: "comm-1", author: "Aman Preet", avatar: "🔥", text: `Any suggestions on where to practice files from lesson: "${lesson.title}"?`, time: "3h ago" },
      { id: "comm-2", author: mentor.name, avatar: mentor.avatar, text: `Aman, check the Resources tab underneath! I've loaded the project template ZIP precisely for you. Keep polishing!`, time: "25m ago", isMentor: true },
    ];
    setCommentsList(initialDiscussions);

    // Save offline check
    const isOffline = localStorage.getItem(`downloaded_${lesson.id}`) === "true";
    if (isOffline && !offlineLessons.includes(lesson.id)) {
      setOfflineLessons(prev => [...prev, lesson.id]);
    }

    // Reset progress timers
    const savedPct = localStorage.getItem(`lesson_progress_${lesson.id}`);
    const savedTime = localStorage.getItem(`lesson_time_${lesson.id}`);
    const progressVal = savedPct ? parseFloat(savedPct) : 0;
    const timeVal = savedTime ? parseFloat(savedTime) : 0;
    setVideoProgress(progressVal >= 100 ? 0 : progressVal);
    setCurrentTimeSec(progressVal >= 100 ? 0 : timeVal);
  };

  // Playback helpers for YT
  const playCustomYTVideo = () => {
    if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === "function") {
      try {
        ytPlayerRef.current.playVideo();
        setIsVideoPlaying(true);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const pauseCustomYTVideo = () => {
    if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === "function") {
      try {
        ytPlayerRef.current.pauseVideo();
        setIsVideoPlaying(false);
      } catch (e) {
        console.log(e);
      }
    }
  };

  // Dynamic YT player setup & sync
  useEffect(() => {
    let interval: any = null;

    if (activeLesson) {
      const videoId = getYoutubeVideoId(activeLesson.videoUrl);
      if (videoId) {
        // Load YouTube API script if not loaded
        if (!(window as any).YT) {
          const tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          const firstScriptTag = document.getElementsByTagName("script")[0];
          firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
        }

        const initYTPlayer = () => {
          const savedTime = localStorage.getItem(`lesson_time_${activeLesson.id}`);
          const startSec = savedTime ? parseFloat(savedTime) : 0;

          if (ytPlayerRef.current) {
            try {
              ytPlayerRef.current.destroy();
            } catch (e) {
              console.log("Error destroying old player", e);
            }
            ytPlayerRef.current = null;
          }

          try {
            ytPlayerRef.current = new (window as any).YT.Player("youtube-player", {
              videoId: videoId,
              playerVars: {
                start: Math.floor(startSec),
                enablejsapi: 1,
                modestbranding: 1,
                rel: 0,
                origin: window.location.origin
              },
              events: {
                onStateChange: (event: any) => {
                  if (event.data === (window as any).YT.PlayerState.PLAYING) {
                    setIsVideoPlaying(true);
                  } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
                    setIsVideoPlaying(false);
                  } else if (event.data === (window as any).YT.PlayerState.ENDED) {
                    setIsVideoPlaying(false);
                    setVideoProgress(100);
                    localStorage.setItem(`lesson_progress_${activeLesson.id}`, "100");
                    localStorage.setItem(`lesson_time_${activeLesson.id}`, "0");
                    handleCompleteLesson(activeLesson);
                  }
                }
              }
            });
          } catch (error) {
            console.error("Failed to create YT Player", error);
          }
        };

        if ((window as any).YT && (window as any).YT.Player) {
          initYTPlayer();
        } else {
          const checkAPI = setInterval(() => {
            if ((window as any).YT && (window as any).YT.Player) {
              clearInterval(checkAPI);
              initYTPlayer();
            }
          }, 200);
          return () => clearInterval(checkAPI);
        }

        // Setup ticking progress logic
        interval = setInterval(() => {
          if (
            ytPlayerRef.current &&
            typeof ytPlayerRef.current.getCurrentTime === "function" &&
            typeof ytPlayerRef.current.getDuration === "function"
          ) {
            try {
              const current = ytPlayerRef.current.getCurrentTime();
              const duration = ytPlayerRef.current.getDuration() || 1;
              if (duration > 2) {
                const pct = Math.round((current / duration) * 100);
                setVideoProgress(pct);
                setCurrentTimeSec(current);
                localStorage.setItem(`lesson_progress_${activeLesson.id}`, pct.toString());
                localStorage.setItem(`lesson_time_${activeLesson.id}`, current.toString());
              }
            } catch (err) {
              // Ignore temporary load glitches
            }
          }
        }, 1000);
      }
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeLesson]);

  // Adjust playback speed of player
  useEffect(() => {
    if (activeLesson) {
      if (getYoutubeVideoId(activeLesson.videoUrl)) {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.setPlaybackRate === "function") {
          try { ytPlayerRef.current.setPlaybackRate(playbackSpeed); } catch(e){}
        }
      } else if (videoElRef.current) {
        videoElRef.current.playbackRate = playbackSpeed;
      }
    }
  }, [playbackSpeed, activeLesson, isVideoPlaying]);

  // Simulated Player Tick for normal MP4 videos or offline previews
  useEffect(() => {
    let interval: any = null;
    if (activeLesson && isVideoPlaying && !getYoutubeVideoId(activeLesson.videoUrl)) {
      interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) {
            setIsVideoPlaying(false);
            clearInterval(interval);
            handleCompleteLesson(activeLesson);
            localStorage.setItem(`lesson_progress_${activeLesson.id}`, "100");
            localStorage.setItem(`lesson_time_${activeLesson.id}`, "0");
            return 100;
          }
          const increment = 1.5 * playbackSpeed;
          const nextProgress = Math.min(prev + increment, 100);
          localStorage.setItem(`lesson_progress_${activeLesson.id}`, nextProgress.toString());
          
          const durSec = 180; // Default simulated length is 3 minutes
          const virtualTime = (nextProgress / 100) * durSec;
          setCurrentTimeSec(virtualTime);
          localStorage.setItem(`lesson_time_${activeLesson.id}`, virtualTime.toString());

          if (nextProgress >= 100) {
            setIsVideoPlaying(false);
            clearInterval(interval);
            handleCompleteLesson(activeLesson);
          }
          return nextProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying, activeLesson, playbackSpeed]);

  // Sync native HTML5 video
  const handleLoadedMetadata = () => {
    if (videoElRef.current && activeLesson) {
      const savedTime = localStorage.getItem(`lesson_time_${activeLesson.id}`);
      if (savedTime) {
        const time = parseFloat(savedTime);
        if (time < videoElRef.current.duration - 1) {
          videoElRef.current.currentTime = time;
          setCurrentTimeSec(time);
        }
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoElRef.current && activeLesson) {
      const current = videoElRef.current.currentTime;
      const duration = videoElRef.current.duration || 1;
      const pct = Math.round((current / duration) * 100);
      setVideoProgress(pct);
      setCurrentTimeSec(current);
      localStorage.setItem(`lesson_progress_${activeLesson.id}`, pct.toString());
      localStorage.setItem(`lesson_time_${activeLesson.id}`, current.toString());
    }
  };

  const handleVideoEnded = () => {
    if (activeLesson) {
      handleCompleteLesson(activeLesson);
      setIsVideoPlaying(false);
      setVideoProgress(100);
    }
  };

  // Complete a lesson logic
  const handleCompleteLesson = (lesson: EnhancedLesson) => {
    const wasAlreadyCompleted = profile.completedLessons.includes(lesson.id);
    
    // Add lesson XP and mark complete
    const updatedLessons = [...profile.completedLessons];
    if (!wasAlreadyCompleted) {
      updatedLessons.push(lesson.id);
    }

    let xpGained = wasAlreadyCompleted ? 15 : lesson.xpReward;
    let newXp = profile.xp + xpGained;

    let updatedCourses = [...profile.completedCourses];
    let msg = wasAlreadyCompleted 
      ? `Reviewed "${lesson.title}"! (+15 XP)` 
      : `🔥 Completed step lesson "${lesson.title}"! (+${lesson.xpReward} XP)`;

    // Check if whole course is completed!
    if (activeCourse) {
      const courseLessonsIds = activeCourse.lessons.map(l => l.id);
      const isNowFinished = courseLessonsIds.every(id => id === lesson.id ? true : updatedLessons.includes(id));
      
      if (isNowFinished && !profile.completedCourses.includes(activeCourse.id)) {
        updatedCourses.push(activeCourse.id);
        const bonusXp = activeCourse.xpReward;
        newXp += bonusXp;
        xpGained += bonusXp;
        msg = `🎓 COURSE CONQUERED! You earned the "${activeCourse.badge}" badge! (+${bonusXp} XP)`;

        if (!profile.unlockedAchievements.includes(activeCourse.id)) {
          profile.unlockedAchievements.push(activeCourse.id);
        }
      }
    }

    onUpdateProfile({
      ...profile,
      completedLessons: updatedLessons,
      completedCourses: updatedCourses,
      xp: newXp
    });

    onCompleteChallengeAction("watch_lesson");
    setCompletionAlert({ text: msg, xp: xpGained });
    setTimeout(() => setCompletionAlert(null), 4000);

    // Initialize Auto Next countdown
    if (activeCourse) {
      const idx = activeCourse.lessons.findIndex(l => l.id === lesson.id);
      if (idx !== -1 && idx < activeCourse.lessons.length - 1) {
        setAutoNextCounter(4);
      }
    }
  };

  // Auto next counter trigger
  useEffect(() => {
    let timer: any = null;
    if (autoNextCounter !== null && autoNextCounter > 0) {
      timer = setTimeout(() => {
        setAutoNextCounter(prev => prev! - 1);
      }, 1000);
    } else if (autoNextCounter === 0) {
      setAutoNextCounter(null);
      if (activeCourse && activeLesson) {
        const idx = activeCourse.lessons.findIndex(l => l.id === activeLesson.id);
        if (idx !== -1 && idx < activeCourse.lessons.length - 1) {
          handleLessonSelect(activeCourse.lessons[idx + 1], activeCourse);
        }
      }
    }
    return () => clearTimeout(timer);
  }, [autoNextCounter]);

  // Simulated Lesson Download Mode
  const handleDownloadLesson = (lessonId: string) => {
    if (offlineLessons.includes(lessonId)) {
      // Remove offline
      setOfflineLessons(prev => prev.filter(id => id !== lessonId));
      localStorage.removeItem(`downloaded_${lessonId}`);
      return;
    }

    setIsDownloading(lessonId);
    setDownloadProgress(prev => ({ ...prev, [lessonId]: 0 }));

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setDownloadProgress(prev => ({ ...prev, [lessonId]: currentProgress }));
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setOfflineLessons(prev => [...prev, lessonId]);
        setIsDownloading(null);
        localStorage.setItem(`downloaded_${lessonId}`, "true");
        setCompletionAlert({ text: `💾 Downloaded! Ready for Offline playback.`, xp: 0 });
        setTimeout(() => setCompletionAlert(null), 3000);
      }
    }, 200);
  };

  // Save Video Learning Notes with dynamic timestamps!
  const handleSaveNote = () => {
    if (!customNotes.trim() || !activeLesson) return;
    
    const newNote = {
      id: `note-${Date.now()}`,
      time: currentTimeSec,
      text: customNotes,
      date: new Date().toLocaleDateString()
    };
    
    const updated = [newNote, ...notesList];
    setNotesList(updated);
    localStorage.setItem(`notes_${activeLesson.id}`, JSON.stringify(updated));
    setCustomNotes("");
  };

  const handleJumpToTime = (secs: number) => {
    setCurrentTimeSec(secs);
    if (videoElRef.current) {
      videoElRef.current.currentTime = secs;
    }
    if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === "function") {
      try { ytPlayerRef.current.seekTo(Math.floor(secs), true); } catch(e){}
    }
    setIsVideoPlaying(true);
  };

  // Save & delete single note
  const handleDeleteNote = (noteId: string) => {
    if (!activeLesson) return;
    const updated = notesList.filter(n => n.id !== noteId);
    setNotesList(updated);
    localStorage.setItem(`notes_${activeLesson.id}`, JSON.stringify(updated));
  };

  // Discussion comments & Smart AI reply mock
  const handlePostComment = () => {
    if (!userComment.trim() || !activeCourse || !activeLesson) return;

    const newComment = {
      id: `comm-u-${Date.now()}`,
      author: profile.displayName || "Gamer teen",
      avatar: profile.avatar || "🎮",
      text: userComment,
      time: "Just now"
    };

    setCommentsList(prev => [...prev, newComment]);
    const capturedText = userComment;
    setUserComment("");
    setIsMentorReplying(true);

    // Dynamic mentor guidance simulation
    setTimeout(() => {
      setIsMentorReplying(false);
      const mentor = ENHANCED_INSTRUCTORS[activeCourse.mentorName] || Object.values(ENHANCED_INSTRUCTORS)[0];
      
      let aiResponseText = `Outstanding input! Keep experimenting with key structures and share your practice exports. That is how we refine the hustle.`;
      
      const textLower = capturedText.toLowerCase();
      if (textLower.includes("cut") || textLower.includes("trim")) {
        aiResponseText = `Yes! Cutting on beat spikes visual pacing. Try grouping your J-cuts right as the transient peaks! Check out Resources for step templates.`;
      } else if (textLower.includes("lut") || textLower.includes("color") || textLower.includes("grade")) {
        aiResponseText = `Color grading sets the mood! Remember to drop background midtones by 5% so your foreground texts stand out boldly.`;
      } else if (textLower.includes("sound") || textLower.includes("audio") || textLower.includes("duck")) {
        aiResponseText = `Audio level rules: Background music keyframes are best capped at -24dB whenever you include custom voice narrations.`;
      } else if (textLower.includes("tool") || textLower.includes("prompt") || textLower.includes("gemini")) {
        aiResponseText = `Exactly! When prompting, write negative limits in ALL-CAPS (e.g. DO NOT DEFINE OUTSIDE CODE). Models adhere to caps weightings much better.`;
      }

      setCommentsList(prev => [...prev, {
        id: `comm-ai-${Date.now()}`,
        author: `${mentor.name} (Course Coach)`,
        avatar: mentor.avatar,
        text: aiResponseText,
        time: "1s ago",
        isMentor: true
      }]);
    }, 1500);
  };

  // Duolingo Practice Drag/Drop simulation submit
  const handleFileDrop = (e: any) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
      setMockFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleSimulateAttachmentSelect = (filename: string) => {
    setMockFileName(filename);
    setUploadedFile(new File([""], filename, { type: "video/mp4" }));
  };

  const triggerPracticeScan = () => {
    if (!mockFileName || !activeLesson?.assignment) return;
    setIsScanningPractice(true);
    setScanStep(0);

    const steps = [
      "🔍 Loading homework payload and resolving dependencies...",
      "🎞️ Scanning resolution parameters, visual aspect structures, and timeline cuts...",
      "🔊 Decoding audio channel decibel bounds...",
      "🤖 Compiling AI feedback review index..."
    ];

    const runSteps = (idx: number) => {
      if (idx < steps.length) {
        setScanStep(idx);
        setTimeout(() => runSteps(idx + 1), 1000);
      } else {
        // Complete Scan Report
        setIsScanningPractice(false);
        const score = Math.floor(Math.random() * 15) + 85; // 85 to 99
        let fbk = `Brilliant submission! Your visual timeline split sequence maps with extreme precision. The retention pacing looks stellar!`;
        
        if (activeLesson.id.includes("capcut")) {
          fbk = `Excellent edit structure! The import parameters look pristine, and the transition timeline cuts are beautifully placed. For 100/100, try dipping the background sound layers by a further -3dB prior to your narrative segments.`;
        } else if (activeLesson.id.includes("shorts")) {
          fbk = `Insane loop hook! The end word ties right back into your opening phrase flawlessly, generating a massive algorithmic hook potential. Keep scaling!`;
        } else if (activeLesson.id.includes("thumb")) {
          fbk = `Great character masks! Human attention flows directly to the outer-glow outline, hitting great contrast zones. Text is very cohesive at microscopic widths!`;
        } else if (activeLesson.id.includes("ai")) {
          fbk = `Highly functional prompt chain stack! The negative delimiters limit conversational bloating perfectly, optimizing target API cost-efficiencies.`;
        }

        setScanReport({
          score: score,
          feedback: fbk,
          checklistPassed: activeLesson.assignment!.checklist.map(() => true),
          xpGained: activeLesson.assignment!.xpReward,
          coinsGained: activeLesson.assignment!.coinsReward
        });
      }
    };

    runSteps(0);
  };

  const claimPracticeRewards = () => {
    if (!scanReport || !activeLesson) return;
    
    const nextXp = profile.xp + scanReport.xpGained;
    
    // Simulate extra coins tracking on portfolio too!
    onUpdateProfile({
      ...profile,
      xp: nextXp,
      portfolio: [
        ...profile.portfolio,
        {
          id: `practice-${Date.now()}`,
          title: `Assignment: ${activeLesson.title}`,
          imageUrl: activeCourse?.image || "https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=300",
          likes: Math.floor(Math.random()*25) + 5
        }
      ]
    });

    onCompleteChallengeAction("claim_gig"); // Completes Weekly quest
    setCompletionAlert({ text: `🎉 Practice approved! Earned +${scanReport.xpGained} XP & +${scanReport.coinsGained} SparkCoins!`, xp: scanReport.xpGained });
    setTimeout(() => setCompletionAlert(null), 4000);
    setScanReport(null);
    setUploadedFile(null);
    setMockFileName("");
  };

  // Teacher profile Actions
  const handleToggleFollow = (mentorName: string) => {
    if (followedInstructors.includes(mentorName)) {
      setFollowedInstructors(prev => prev.filter(n => n !== mentorName));
    } else {
      setFollowedInstructors(prev => [...prev, mentorName]);
      setCompletionAlert({ text: `👤 Followed ${mentorName}! Stay updated on new tutorials!`, xp: 0 });
      setTimeout(() => setCompletionAlert(null), 3500);
    }
  };

  const handleOpenLiveStream = (instructorName: string) => {
    const inst = ENHANCED_INSTRUCTORS[instructorName] || Object.values(ENHANCED_INSTRUCTORS)[0];
    setActiveLiveInstructor(inst);
    setIsLiveRoomOpen(true);
  };

  const handlePostLiveMessage = () => {
    if (!liveUserMsg.trim()) return;
    
    setLiveMessages(prev => [...prev, {
      author: profile.displayName || "SparkTeen",
      avatar: profile.avatar || "👾",
      text: liveUserMsg
    }]);
    
    const usertext = liveUserMsg;
    setLiveUserMsg("");

    // Simulate real-time streamer answering
    setTimeout(() => {
      setLiveMessages(prev => [...prev, {
        author: activeLiveInstructor?.name || "Instructor",
        avatar: activeLiveInstructor?.avatar || "🎤",
        text: `📢 That's a golden query! Yes, I always suggest using standard aspect parameters in CapCut first before importing lifestyle tracks.`
      }]);
    }, 2000);
  };

  // Filter Courses list
  const filteredCourses = ENHANCED_COURSES.filter((course) => {
    const matchCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        course.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Calculate current active lesson trigger overlays
  const currentTimelineTriggers = activeLesson?.timelineTriggers?.filter(
    (trig) => currentTimeSec >= trig.time && currentTimeSec < trig.time + 6
  ) || [];

  // Subtitles logic
  const currentSubtitleCue = activeLesson?.subtitles?.find(
    (sub) => currentTimeSec >= sub.timeStart && currentTimeSec < sub.timeEnd
  );

  return (
    <div className="space-y-4 pb-20 font-sans text-left">
      <AnimatePresence>
        {completionAlert && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 16 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-4 left-6 right-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-600 text-white p-4 rounded-2xl shadow-xl shadow-cyan-500/10 z-50 flex items-center justify-between border border-white/10"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 animate-spin text-cyan-200" />
              <p className="text-xs font-bold font-display">{completionAlert.text}</p>
            </div>
            {completionAlert.xp > 0 && (
              <span className="bg-[#050505] text-cyan-400 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 border border-white/5">
                +{completionAlert.xp} XP
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!activeCourse ? (
        // Catalog Index view
        <>
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-extrabold text-white tracking-tight font-display">Hustler Workspace</h1>
              <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-mono font-bold animate-pulse">
                ● Interactive Video Core Active
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">Learn hot skills step-by-step from viral content veterans.</p>
          </div>

          {/* Search container */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search editing, YouTube, code, presets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-white/5 text-xs px-10 py-3.5 rounded-2xl focus:outline-none focus:border-cyan-400 text-white placeholder-neutral-500 transition-colors"
            />
          </div>

          {/* Category Scroller */}
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-semibold whitespace-nowrap tracking-wide leading-none transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-cyan-400 to-purple-600 text-white font-display shadow-lg shadow-cyan-500/10 shrink-0"
                    : "bg-[#0A0A0B] border border-white/5 text-neutral-400 shrink-0 hover:border-neutral-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Premium Instructors Hub */}
          <div className="bg-[#0A0A0B]/60 rounded-2xl border border-white/5 p-4 space-y-3">
            <h3 className="text-[10px] font-mono font-extrabold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-3.5 h-3.5" /> Featured Creator Vet Coaches
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {Object.values(ENHANCED_INSTRUCTORS).map((instructor) => {
                const isFollowed = followedInstructors.includes(instructor.name);
                return (
                  <div key={instructor.id} className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-lg select-none">
                        {instructor.avatar}
                        {instructor.isLive && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 border border-[#0A0A0B] rounded-full animate-pulse" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white leading-none">{instructor.name}</h4>
                          {instructor.isLive && (
                            <span className="text-[8px] bg-red-500/25 text-red-300 px-1 py-0.2 rounded font-mono uppercase font-black">Live QA</span>
                          )}
                        </div>
                        <p className="text-[9.5px] text-zinc-400 mt-1 leading-none">{instructor.followers} • ⭐ {instructor.rating}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {instructor.isLive && (
                        <button 
                          onClick={() => handleOpenLiveStream(instructor.name)}
                          className="bg-red-500 hover:bg-red-650 text-white text-[9px] font-black uppercase px-2 py-1.5 rounded-lg transition-transform cursor-pointer"
                        >
                          Join QA
                        </button>
                      )}
                      <button 
                        onClick={() => handleToggleFollow(instructor.name)}
                        className={`text-[9.5px] font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border ${
                          isFollowed 
                            ? "bg-cyan-500/10 border-cyan-400/20 text-cyan-400" 
                            : "bg-neutral-900 border-white/5 text-white hover:bg-[#0A0A0B]"
                        }`}
                      >
                        {isFollowed ? "Following ✅" : "Follow"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courses grid portfolio */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono font-extrabold text-[#A1A1A8] uppercase tracking-wider">Premium Guided Workshops</h3>
            <div className="space-y-4">
              {filteredCourses.map((course) => {
                const completeCount = course.lessons.filter(l => profile.completedLessons.includes(l.id)).length;
                const ratio = Math.round((completeCount / course.lessons.length) * 100);
                const isFinished = profile.completedCourses.includes(course.id);

                return (
                  <div
                    key={course.id}
                    onClick={() => {
                      setActiveCourse(course);
                      const uncompleted = course.lessons.find((l) => !profile.completedLessons.includes(l.id));
                      handleLessonSelect(uncompleted || course.lessons[0], course);
                    }}
                    className="bg-[#0A0A0B] rounded-2xl border border-white/5 overflow-hidden group hover:border-[#1C1C1E] cursor-pointer transition-all flex flex-col shadow-lg"
                  >
                    <div className="relative h-32">
                      <img src={course.image} alt="" className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-80" />
                      <span className="absolute top-3 left-3 bg-neutral-950/90 backdrop-blur-md text-[9px] text-cyan-300 font-mono font-bold px-2.5 py-0.5 rounded-md border border-white/5 uppercase tracking-wide">
                        {course.category}
                      </span>
                      {isFinished && (
                        <span className="absolute bottom-3 right-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-2.5 py-1 rounded font-mono font-bold text-[8.5px] flex items-center gap-1 shadow-md shadow-emerald-500/10">
                          <Check className="w-3.5 h-3.5" /> MASTER UNLOCKED
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug font-display">{course.title}</h4>
                        <p className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1 font-mono">
                          <span>Coached by {course.mentorName}</span> • <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {course.rating}
                        </p>
                      </div>
                      
                      {/* Step index overview roadmap */}
                      <div className="grid grid-cols-4 gap-1 pt-1">
                        {course.lessons.map((lesson, stepIdx) => {
                          const isCmp = profile.completedLessons.includes(lesson.id);
                          return (
                            <div key={lesson.id} className="space-y-1">
                              <div className={`h-1 rounded-full transition-colors ${isCmp ? "bg-cyan-400" : "bg-neutral-800"}`} />
                              <p className="text-[8px] font-mono font-semibold text-neutral-500 truncate">S{stepIdx+1}: {lesson.title}</p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-neutral-400 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-neutral-500" /> {course.lessons.length} Step-blocks
                        </span>
                        <span className="text-cyan-300 font-bold">+{course.xpReward} XP Core Badge</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        // Course Player Room View - Desktop-style cinematic screen view
        <div className="space-y-4">
          {/* Back breadcrumb container */}
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <button
              onClick={() => {
                setActiveCourse(null);
                setActiveLesson(null);
                setIsVideoPlaying(false);
              }}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white cursor-pointer font-bold font-mono"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" /> Back to Workshops
            </button>
            <div className="flex items-center gap-1 bg-cyan-950/30 text-cyan-300 border border-cyan-500/20 px-2.5 py-0.5 rounded-full font-mono text-[9.5px] font-bold">
              <BookOpen className="w-3 h-3" /> Step {activeLesson?.stepNumber} of 4 • {activeCourse.title}
            </div>
          </div>

          {/* Interactive Player Shell Block */}
          <div className="bg-[#0A0A0B] border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
            {activeLesson ? (
              <div className="relative bg-[#050505] aspect-video flex flex-col justify-between overflow-hidden">
                {/* 1. Playback layers */}
                {activeLesson.videoUrl && getYoutubeVideoId(activeLesson.videoUrl) ? (
                  <div className="absolute inset-0 w-full h-full bg-black">
                    <div id="youtube-player" className="w-full h-full" />
                  </div>
                ) : activeLesson.videoUrl && isVideoPlaying ? (
                  <video
                    ref={videoElRef}
                    src={activeLesson.videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnded}
                  />
                ) : (
                  // Static lesson cover placeholder when paused or simulated init
                  <div className="absolute inset-0 bg-[#0A0A0B] flex flex-col items-center justify-center p-4 text-center">
                    <img src={activeCourse.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15 filter blur-xs" />
                    <div className="relative z-10 space-y-4">
                      <div 
                        onClick={() => {
                          const isYt = getYoutubeVideoId(activeLesson.videoUrl);
                          if (isYt) {
                            playCustomYTVideo();
                          } else {
                            setIsVideoPlaying(true);
                            if (videoElRef.current) videoElRef.current.play().catch(()=>{});
                          }
                        }}
                        className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                      >
                        <Play className="w-6 h-6 fill-white translate-x-0.5 text-white" />
                      </div>
                      <div>
                        {videoProgress > 0 && videoProgress < 100 && (
                          <div className="bg-cyan-400/15 border border-cyan-400/25 px-2.5 py-0.5 rounded-full text-[9px] text-cyan-300 font-mono font-black inline-block mb-2 uppercase">
                            ↩️ RESUME FROM {formatTime(currentTimeSec)} ({videoProgress}%)
                          </div>
                        )}
                        <h4 className="text-xs font-bold text-white font-display uppercase tracking-wider text-cyan-400">
                          {activeLesson.stepLabel}
                        </h4>
                        <h2 className="text-sm font-black text-white mt-0.5 max-w-sm mx-auto">{activeLesson.title}</h2>
                        <p className="text-[9.5px] text-neutral-400 font-mono mt-1">Duration: {activeLesson.duration} • Core Reward +{activeLesson.xpReward} XP</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Interactive Hotspots Timeline Trigger overlay layer! */}
                <AnimatePresence>
                  {currentTimelineTriggers.map((trig, idx) => (
                    <motion.div
                      key={`trig-${idx}`}
                      initial={{ opacity: 0, scale: 0.9, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -15 }}
                      className="absolute z-30 top-3 left-3 right-3 bg-black/85 backdrop-blur-md rounded-xl border border-cyan-400/30 p-2.5 shadow-xl flex items-start gap-2 max-w-md"
                    >
                      <div className="w-6 h-6 bg-cyan-400/10 text-cyan-300 rounded-lg flex items-center justify-center shrink-0">
                        {trig.type === "ai_explain" ? <Cpu className="w-3.5 h-3.5 text-cyan-400" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-400" />}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono uppercase font-black text-cyan-300 tracking-wider">
                            {trig.title}
                          </span>
                          <span className="text-[8px] bg-neutral-900 text-neutral-400 px-1 py-0.2 font-mono">Real-time overlay</span>
                        </div>
                        <h5 className="text-[10.5px] font-bold text-white mt-0.5">{trig.description}</h5>
                        {trig.tipContent && (
                          <p className="text-[9px] text-neutral-300 border-l border-cyan-400/20 pl-1.5 mt-1 leading-normal font-sans italic bg-cyan-500/5 p-1 rounded">
                            "{trig.tipContent}"
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Pulsing Target Overlay hotspot simulation */}
                <AnimatePresence>
                  {currentTimelineTriggers.map((trig, idx) => {
                    if (trig.type === "highlight") {
                      return (
                        <motion.div
                          key={`hotspot-${idx}`}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute pointer-events-none select-none z-20"
                          style={{
                            left: `${trig.x || 50}%`,
                            top: `${trig.y || 50}%`,
                            transform: "translate(-50%, -50%)"
                          }}
                        >
                          <span className="relative flex h-8 w-8">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
                            <span className="relative inline-flex rounded-full h-8 w-8 bg-cyan-500/40 border border-cyan-400 flex items-center justify-center">
                              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                            </span>
                          </span>
                          <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-black/90 border border-cyan-400/30 text-[8.5px] text-white px-2 py-0.5 rounded font-mono font-bold whitespace-nowrap shadow-lg">
                            CLICK FX REGION
                          </div>
                        </motion.div>
                      );
                    }
                    return null;
                  })}
                </AnimatePresence>

                {/* 3. Subtitle Overlay screen tracking */}
                {captionLanguage !== "none" && currentSubtitleCue && (
                  <div className="absolute inset-x-4 bottom-14 z-20 text-center pointer-events-none">
                    <span className="bg-black/85 backdrop-blur-xs border border-white/10 px-3 py-1.5 rounded-xl text-[10px] md:text-sm font-bold text-yellow-300 inline-block font-sans drop-shadow-md leading-normal tracking-wide max-w-lg">
                      {captionLanguage === "en" ? currentSubtitleCue.en : currentSubtitleCue.hi}
                    </span>
                  </div>
                )}

                {/* Auto Next countdown overlay */}
                {autoNextCounter !== null && (
                  <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-30 flex flex-col items-center justify-center text-center p-4">
                    <Sparkles className="w-10 h-10 text-cyan-400 animate-spin mb-2" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Graduating to Next Milestone</h3>
                    <p className="text-[13px] font-black text-cyan-300 mt-1">Starting next lesson in {autoNextCounter} seconds...</p>
                    <button 
                      onClick={() => setAutoNextCounter(null)}
                      className="mt-4 px-4 py-1.5 bg-[#0A0A0B] border border-white/5 text-[9.5px] text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel countdown
                    </button>
                  </div>
                )}

                {/* 4. Elegant custom control mechanics panel bar */}
                <div className="p-3 bg-gradient-to-t from-neutral-950 via-[#050505]/95 to-transparent flex flex-col gap-2 z-10 border-t border-white/5 shadow-inner">
                  {/* Seek Progress slider */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-[8px] font-mono text-zinc-400 font-semibold">{formatTime(currentTimeSec)}</span>
                    <div 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickPct = (e.clientX - rect.left) / rect.width;
                        const targetTime = Math.round(clickPct * (getYoutubeVideoId(activeLesson.videoUrl) ? 180 : 180)); // 180s virtual reference
                        handleJumpToTime(targetTime);
                      }}
                      className="flex-1 h-1.5 bg-white/15 rounded-full relative cursor-pointer group"
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-cyan-400 rounded-full transition-all" style={{ width: `${videoProgress}%` }} />
                      <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${videoProgress}% - 5px)` }} />
                    </div>
                    <span className="text-[8px] font-mono text-zinc-400 font-semibold">{activeLesson.duration}</span>
                  </div>

                  {/* Operational control hubs */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const isYt = activeLesson && getYoutubeVideoId(activeLesson.videoUrl);
                          if (isYt) {
                            if (isVideoPlaying) {
                              pauseCustomYTVideo();
                            } else {
                              playCustomYTVideo();
                            }
                          } else {
                            setIsVideoPlaying(!isVideoPlaying);
                          }
                        }}
                        className="p-1 px-3 bg-cyan-400/10 border border-cyan-400/20 hover:bg-cyan-400/20 text-cyan-300 text-[10px] font-bold rounded-lg transition-colors"
                      >
                        {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-cyan-300 text-cyan-300" />}
                      </button>

                      {/* Playback speed selector */}
                      <select
                        onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                        value={playbackSpeed}
                        className="bg-black border border-white/5 text-[9.5px] text-zinc-400 px-2 py-1 rounded-lg focus:outline-none focus:border-cyan-400 font-mono"
                      >
                        <option value="0.5">0.5x Speed</option>
                        <option value="1">1.0x Normal</option>
                        <option value="1.25">1.25x Fast</option>
                        <option value="1.5">1.5x Expert</option>
                        <option value="2">2.0x Crazy</option>
                      </select>

                      {/* Subtitled captions toggles */}
                      <button
                        onClick={() => {
                          if (captionLanguage === "en") setCaptionLanguage("hi");
                          else if (captionLanguage === "hi") setCaptionLanguage("none");
                          else setCaptionLanguage("en");
                        }}
                        className={`p-1 px-2.5 rounded-lg border text-[9px] font-mono flex items-center gap-1 transition-all ${
                          captionLanguage !== "none" 
                            ? "bg-purple-500/10 border-purple-500/20 text-purple-400" 
                            : "bg-black border-white/5 text-zinc-400"
                        }`}
                      >
                        <Subtitles className="w-3 h-3" /> Captions: {captionLanguage.toUpperCase()}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Offline download simulation */}
                      <button
                        onClick={() => handleDownloadLesson(activeLesson.id)}
                        disabled={isDownloading === activeLesson.id}
                        className={`p-1 px-2.5 rounded-lg border text-[9px] font-mono flex items-center gap-1 transition-all ${
                          offlineLessons.includes(activeLesson.id)
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold"
                            : "bg-black border-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {isDownloading === activeLesson.id ? (
                          <>
                            <span className="w-2 h-2 rounded-full border border-zinc-400 border-t-transparent animate-spin inline-block" />
                            <span>Saving {downloadProgress[activeLesson.id]}%</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3 h-3 text-cyan-400" />
                            <span>{offlineLessons.includes(activeLesson.id) ? "Offline Ready ✅" : "Download Guide"}</span>
                          </>
                        )}
                      </button>

                      {/* Complete status indicator */}
                      <span className="text-[9.5px] text-zinc-400 font-mono capitalize tracking-wider font-extrabold flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isVideoPlaying ? "bg-cyan-400 animate-pulse" : "bg-neutral-600"}`} />
                        {isVideoPlaying ? "Streaming live" : "lecture paused"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-[#050505] flex items-center justify-center text-neutral-400 text-xs text-center p-6">
                Click a lesson block from course roadway below to start.
              </div>
            )}
            
            {/* Descriptive Instructor Badge Underneath player */}
            <div className="p-4 bg-[#0A0A0B] border-t border-white/5 flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
              <div>
                <h2 className="text-sm font-black text-white font-display text-left">{activeCourse.title}</h2>
                <div className="flex gap-2 items-center text-[10.5px] text-neutral-400 font-mono mt-1">
                  <span className="text-cyan-400 font-black uppercase text-[9.5px] tracking-wider">{activeCourse.category}</span>
                  <span>•</span>
                  <span>Coached by <b className="text-white underline cursor-pointer" onClick={() => handleOpenLiveStream(activeCourse.mentorName)}>{activeCourse.mentorName}</b></span>
                </div>
              </div>
              <button 
                onClick={() => handleOpenLiveStream(activeCourse.mentorName)}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-3 py-1 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider scale-[0.95] shrink-0"
              >
                Join Live Stream
              </button>
            </div>
          </div>

          {/* Interactive Learning Panels (Tabs layout below) */}
          <div className="grid grid-cols-1 gap-4">
            
            {/* Horizontal Tabs control buttons */}
            <div className="flex gap-1.5 bg-[#0A0A0B] border border-white/5 p-1 rounded-xl scrollbar-none overflow-x-auto">
              <button
                onClick={() => setActiveTab2("index")}
                className={`flex-1 min-w-[80px] p-2 rounded-lg text-[10px] font-bold tracking-wide transition-all ${
                  activeTab === "index" ? "bg-neutral-900 border border-white/5 text-cyan-300" : "text-neutral-400"
                }`}
              >
                🎥 Course Steps
              </button>
              <button
                onClick={() => setActiveTab2("notes")}
                className={`flex-1 min-w-[80px] p-2 rounded-lg text-[10px] font-bold tracking-wide transition-all flex items-center justify-center gap-1 ${
                  activeTab === "notes" ? "bg-neutral-900 border border-white/5 text-cyan-300" : "text-neutral-400"
                }`}
              >
                ✍️ Video Notes {notesList.length > 0 && <span className="bg-cyan-500 text-black text-[8.5px] font-mono px-1 rounded-full">{notesList.length}</span>}
              </button>
              <button
                onClick={() => setActiveTab2("resources")}
                className={`flex-1 min-w-[80px] p-2 rounded-lg text-[10px] font-bold tracking-wide transition-all flex items-center justify-center gap-1 ${
                  activeTab === "resources" ? "bg-neutral-900 border border-white/5 text-cyan-300" : "text-neutral-400"
                }`}
              >
                📂 Materials {activeLesson?.resources && <span className="bg-purple-500 text-white text-[8.5px] font-mono px-1.5 rounded-full">{activeLesson.resources.length}</span>}
              </button>
              <button
                onClick={() => setActiveTab2("discussion")}
                className={`flex-1 min-w-[80px] p-2 rounded-lg text-[10px] font-bold tracking-wide transition-all flex items-center justify-center gap-1 ${
                  activeTab === "discussion" ? "bg-neutral-900 border border-white/5 text-cyan-300" : "text-neutral-400"
                }`}
              >
                💬 Peer QA Chat
              </button>
            </div>

            {/* TAB CONTENT VIEWS */}
            <div className="bg-[#0A0A0B]/60 border border-white/5 rounded-2xl p-4 min-h-[160px]">
              
              {/* TAB A: COURSE INDEX ROADMAP SIDEBAR */}
              {activeTab === "index" && (
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <h3 className="text-xs font-bold text-[#A1A1A8] uppercase tracking-wider font-mono">Duo Learning Roadmaps</h3>
                    <span className="text-[9.5px] text-cyan-400 font-mono">Progress: {Math.round((activeCourse.lessons.filter(l => profile.completedLessons.includes(l.id)).length / activeCourse.lessons.length) * 100)}%</span>
                  </div>
                  <div className="space-y-1.5">
                    {activeCourse.lessons.map((lesson, index) => {
                      const isCmp = profile.completedLessons.includes(lesson.id);
                      const isActive = activeLesson?.id === lesson.id;
                      const indexStr = (index + 1).toString().padStart(2, "0");

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => handleLessonSelect(lesson, activeCourse)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 justify-between ${
                            isActive
                              ? "bg-neutral-900 border-cyan-500/20 text-white"
                              : "bg-black/20 border-white/5 hover:border-neutral-800 text-neutral-300"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="font-mono text-xs font-bold text-neutral-500 shrink-0">{indexStr}</span>
                            <div className="min-w-0">
                              <h4 className={`text-xs font-bold ${isCmp ? "text-neutral-500 line-through" : "text-white"} truncate`}>
                                {lesson.title}
                              </h4>
                              <p className="text-[9px] text-[#A1A1A8] font-mono flex items-center gap-1 mt-0.5">
                                <span className="bg-neutral-800 text-[8px] text-zinc-400 px-1.5 py-0.2 rounded uppercase font-black tracking-widest">{lesson.stepType}</span>
                                <span>•</span>
                                <Clock className="w-3 h-3 text-neutral-500" /> {lesson.duration} 
                                <span>•</span> 
                                <span className="text-cyan-300 font-bold">+{lesson.xpReward} XP</span>
                              </p>
                            </div>
                          </div>
                          {isCmp ? (
                            <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-white/10 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB B: INTERACTIVE TIMESTAMP NOTES */}
              {activeTab === "notes" && (
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Timestamp Notepad</h3>
                      <p className="text-[9px] text-[#A1A1A8]">Draft and jump directly to timelines dynamically!</p>
                    </div>
                    <span className="text-[9px] bg-cyan-400/10 text-cyan-300 px-2 py-0.5 rounded font-mono font-bold">
                      ⌚ Lock @ {formatTime(currentTimeSec)}
                    </span>
                  </div>

                  <div className="flex gap-1.5 pt-1.5">
                    <input
                      type="text"
                      placeholder="Type a workflow tip (e.g. 'Use C key to split timelines here')..."
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveNote()}
                      className="flex-1 bg-black/60 border border-white/5 text-xs px-3 py-2.5 rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={handleSaveNote}
                      className="bg-cyan-400 hover:bg-cyan-300 text-black text-[10.5px] font-extrabold px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Hold Save
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 max-h-[180px] overflow-y-auto scrollbar-thin">
                    {notesList.map((note) => (
                      <div key={note.id} className="bg-black/30 border border-white/5 p-2.5 rounded-xl flex items-center justify-between gap-3 text-left">
                        <div className="min-w-0 flex-1">
                          <div className="flex gap-2 items-center">
                            <span 
                              onClick={() => handleJumpToTime(note.time)}
                              className="text-[9px] font-mono bg-cyan-300/10 border border-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded font-bold cursor-pointer hover:bg-cyan-300 hover:text-black transition-colors shrink-0"
                            >
                              ⏱️ {formatTime(note.time)}
                            </span>
                            <span className="text-[8.5px] text-zinc-500 font-mono">{note.date}</span>
                          </div>
                          <p className="text-xs text-white mt-1 break-words font-sans">{note.text}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 hover:bg-red-500/10 text-[#A1A1A8] hover:text-red-400 rounded transition-colors shrink-0 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {notesList.length === 0 && (
                      <div className="text-center py-6">
                        <FileText className="w-8 h-8 text-[#A1A1A8]/20 mx-auto mb-1.5" />
                        <p className="text-[10px] text-zinc-500 font-mono">No timestamp notes saved. Type above to lock your first guide point!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB C: MATERIALS AND ASSETS DOWNLOAD GRID */}
              {activeTab === "resources" && (
                <div className="space-y-3 text-left">
                  <div className="pb-2 border-b border-white/5">
                    <h3 className="text-xs font-bold text-[#A1A1A8] uppercase tracking-wider font-mono">Lesson Project Files</h3>
                    <p className="text-[9px] text-[#A1A1A8] mt-0.5">Use the coach's direct files to complete assignments.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {activeLesson.resources?.map((item, idx) => {
                      const isOffline = offlineLessons.includes(item.name);
                      return (
                        <div key={idx} className="bg-black/35 border border-white/5 rounded-xl p-3 flex items-center justify-between gap-3 text-left">
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                            <p className="text-[9px] text-neutral-400 font-mono uppercase mt-0.5">{item.type} • {item.size}</p>
                          </div>
                          <button
                            onClick={() => {
                              // Simulate standard asset caching
                              handleDownloadLesson(item.name);
                            }}
                            className={`p-1.5 px-3 rounded-lg border text-[9.5px] font-mono flex items-center gap-1 cursor-pointer transition-all ${
                              offlineLessons.includes(item.name)
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-semibold"
                                : "bg-neutral-900 border-white/5 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <Download className="w-3 h-3 text-cyan-300" />
                            <span>{offlineLessons.includes(item.name) ? "Ready 💾" : "Get file"}</span>
                          </button>
                        </div>
                      );
                    })}

                    {!activeLesson.resources || activeLesson.resources.length === 0 ? (
                      <div className="col-span-2 text-center py-6 text-[10px] text-zinc-500 font-mono">
                        No custom attachments uploaded for this workshop step.
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* TAB D: DISCUSSION AND AUTOMATED PEER QA CHAT */}
              {activeTab === "discussion" && (
                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Teens Peer QA Room</h3>
                      <p className="text-[9px] text-[#A1A1A8] mt-0.5">Live chatbot support directly from our Creator Coach index.</p>
                    </div>
                  </div>

                  {/* Comments lists */}
                  <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
                    {commentsList.map((comm) => (
                      <div key={comm.id} className={`p-2.5 rounded-xl text-left border ${
                        comm.isMentor 
                          ? "bg-purple-950/20 border-purple-500/20 pl-3.5" 
                          : "bg-black/30 border-white/5"
                      }`}>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs shrink-0">{comm.avatar}</span>
                          <span className={`text-[10px] font-extrabold ${comm.isMentor ? "text-purple-400" : "text-white"}`}>
                            {comm.author}
                          </span>
                          <span className="text-[8px] text-zinc-500 font-mono">{comm.time}</span>
                        </div>
                        <p className="text-[11px] text-zinc-300 mt-1 leading-normal pl-1.5 font-sans break-words">{comm.text}</p>
                      </div>
                    ))}

                    {isMentorReplying && (
                      <div className="bg-purple-950/15 border border-dashed border-purple-500/10 p-2.5 rounded-xl flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                        <span className="text-[9.5px] text-purple-300 font-mono">Course Coach is analyzing and drafting a smart response...</span>
                      </div>
                    )}
                  </div>

                  {/* Publish input */}
                  <div className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Ask the coach/mentor a question (e.g. 'How to trim music nicely?')..."
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
                      className="flex-1 bg-black/60 border border-white/5 text-xs px-3 py-2.5 rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      onClick={handlePostComment}
                      className="p-2.5 bg-neutral-900 hover:bg-[#0A0A0B] border border-white/10 text-cyan-300 rounded-xl cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* DUOLINGO STYLE PRACTICE ASSIGNMENT MODE WORKSPACE */}
            {activeLesson.assignment && (
              <div className="bg-gradient-to-br from-cyan-950/20 via-[#0A0A0B] to-purple-950/20 rounded-2xl border border-white/10 p-4 space-y-4 shadow-xl relative overflow-hidden text-left">
                <div className="absolute right-0 top-0 translate-x-5 -translate-y-5 w-44 h-44 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[8.5px] font-mono text-cyan-400 uppercase font-black tracking-widest bg-cyan-400/10 px-2.5 py-0.5 rounded-full border border-cyan-400/20">
                      ✨ Practice Challenge Workspace
                    </span>
                    <h3 className="text-xs font-black text-white mt-1.5 font-display flex items-center gap-1">
                      🛠️ {activeLesson.assignment.task}
                    </h3>
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">{activeLesson.assignment.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9.5px] bg-[#050505] text-cyan-300 border border-white/5 font-mono font-bold px-2 py-1 rounded-full shrink-0">
                      +{activeLesson.assignment.xpReward} XP Reward
                    </span>
                  </div>
                </div>

                {/* Checklist targets list */}
                <div className="space-y-1.5 bg-black/35 border border-white/5 p-3 rounded-xl text-left">
                  <p className="text-[9.5px] font-mono text-zinc-400 uppercase font-black">Success Parameters</p>
                  <div className="space-y-1">
                    {activeLesson.assignment.checklist.map((item, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 bg-cyan-500/10 border border-cyan-400/30 rounded-md flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-cyan-400" />
                        </div>
                        <span className="text-[10px] text-zinc-300 font-sans">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* File upload drag/drop container */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`border border-dashed rounded-xl p-4 transition-all text-center flex flex-col justify-center items-center ${
                    isDragOver 
                      ? "border-cyan-400 bg-cyan-550/5 scale-[1.01]" 
                      : mockFileName 
                        ? "border-emerald-500/50 bg-emerald-500/5" 
                        : "border-[#1C1C1E] bg-black/30 hover:border-neutral-800"
                  }`}
                >
                  <UploadCloud className={`w-8 h-8 ${mockFileName ? "text-emerald-400" : "text-[#A1A1A8]/45"} mb-2 animate-pulse`} />
                  {mockFileName ? (
                    <div className="space-y-1">
                      <p className="text-xs text-white font-mono font-bold">📂 File Linked: <span className="text-emerald-400">{mockFileName}</span></p>
                      <p className="text-[9.5px] text-zinc-400">Payload ready for high contrast AI Grading report.</p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <p className="text-[10.5px] text-zinc-300 font-sans font-bold">Drag & Drop output file here or select sample</p>
                      <p className="text-[9px] text-[#A1A1A8]">Supports mp4, mov, zip, fig, prompt lists</p>
                    </div>
                  )}

                  {!mockFileName && (
                    <div className="flex gap-1.5 pt-3">
                      <button 
                        onClick={() => handleSimulateAttachmentSelect("draft_split_vlog.mp4")}
                        className="bg-neutral-900 border border-white/5 hover:bg-neutral-800 text-white text-[8.5px] font-bold px-2 py-1.5 rounded cursor-pointer"
                      >
                        ⚡ Simulate Vlog.mp4
                      </button>
                      <button 
                        onClick={() => handleSimulateAttachmentSelect("prompt_chain_stack.txt")}
                        className="bg-neutral-900 border border-white/5 hover:bg-neutral-800 text-white text-[8.5px] font-bold px-2 py-1.5 rounded cursor-pointer"
                      >
                        ✍️ Simulate Prompts.txt
                      </button>
                    </div>
                  )}
                </div>

                {/* Trigger grading mechanics action */}
                {mockFileName && !scanReport && (
                  <button
                    onClick={triggerPracticeScan}
                    disabled={isScanningPractice}
                    className="w-full bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-black py-3 rounded-xl font-display shadow-lg shadow-cyan-400/10 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isScanningPractice ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border border-black border-t-transparent animate-spin inline-block" />
                        <span>Scanning video keyframes...</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="w-3.5 h-3.5" />
                        <span>AI Scan & Assess My Submission</span>
                      </>
                    )}
                  </button>
                )}

                {/* AI Scanner processing steps */}
                {isScanningPractice && (
                  <div className="bg-black/80 border border-cyan-400/20 p-3 rounded-xl font-mono text-[9.5px] space-y-1 animate-pulse">
                    <p className="text-cyan-300 tracking-wider">⚡ AI PIPELINE GRADER DEPLOYED:</p>
                    <p className="text-zinc-300">➜ Status: Processing step {scanStep+1} of 4</p>
                    <p className="text-zinc-500">
                      {[
                        "🔍 Loading homework payload...",
                        "🎞️ Analyzing video frame segments...",
                        "🔊 Ducking acoustics balance scan...",
                        "🤖 Review ready!"
                      ][scanStep]}
                    </p>
                  </div>
                )}

                {/* AI Assessment Report slide in */}
                {scanReport && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-black border border-emerald-500/30 rounded-xl p-3.5 space-y-3 text-left"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-emerald-500/20">
                      <div className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-[10px] font-mono uppercase font-black">AI Grade Report Complete</span>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-300 font-mono font-black text-xs px-2.5 py-0.5 rounded-full">
                        {scanReport.score}/100 PASS
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">{scanReport.feedback}</p>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#A1A1A8]">Completed Rewards:</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11.5px]">
                        +{scanReport.xpGained} XP • +{scanReport.coinsGained} Coins 🪙
                      </span>
                    </div>

                    <button
                      onClick={claimPracticeRewards}
                      className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-xs font-black py-2.5 rounded-lg transition-transform cursor-pointer shadow-lg hover:scale-[1.01]"
                    >
                      Receive & Claim Core Spark Level
                    </button>
                  </motion.div>
                )}

              </div>
            )}

          </div>

        </div>
      )}

      {/* CREATOR QA LIVE STUDIO WINDOW MODAL POPUP */}
      <AnimatePresence>
        {isLiveRoomOpen && activeLiveInstructor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#0A0A0B] border border-white/10 rounded-3xl overflow-hidden w-full max-w-sm flex flex-col h-[520px] shadow-2xl relative"
            >
              {/* Head stream bar */}
              <div className="p-4 bg-black border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                  <span className="text-[10.5px] text-red-400 font-mono uppercase font-black tracking-widest shrink-0">Studio QA Live</span>
                </div>
                <button
                  onClick={() => setIsLiveRoomOpen(false)}
                  className="p-1 hover:bg-neutral-900 border border-white/10 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>

              {/* Streaming cover or video avatar representation */}
              <div className="relative bg-neutral-950 aspect-video flex flex-col justify-end p-4 text-left overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                
                {/* Loop aesthetic layout */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-neutral-950 to-purple-950/20 flex flex-col items-center justify-center select-none opacity-40">
                  <div className="w-16 h-16 rounded-full bg-cyan-400/10 flex items-center justify-center text-4xl animate-bounce">
                    {activeLiveInstructor.avatar}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 mt-2">STREAM CAMERA CAPTURING...</span>
                </div>

                <div className="relative z-10 space-y-0.5">
                  <h4 className="text-xs font-extrabold text-white">{activeLiveInstructor.name} Live Studio</h4>
                  <p className="text-[9px] font-mono text-zinc-400">{activeLiveInstructor.followers} tuning in</p>
                </div>
              </div>

              {/* Chats box */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {liveMessages.map((msg, index) => (
                  <div key={index} className="text-left bg-black/40 border border-white/5 rounded-xl p-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs shrink-0">{msg.avatar}</span>
                      <span className="text-[9px] font-bold text-zinc-300">{msg.author}</span>
                    </div>
                    <p className="text-[10px] text-white mt-1 leading-normal pl-1">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Input section */}
              <div className="p-3 bg-black border-t border-white/5 flex gap-1.5">
                <input
                  type="text"
                  placeholder="Draft dynamic stream message..."
                  value={liveUserMsg}
                  onChange={(e) => setLiveUserMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePostLiveMessage()}
                  className="flex-1 bg-neutral-900 border border-white/5 text-xs px-3 py-2.5 rounded-xl placeholder-zinc-500 text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handlePostLiveMessage}
                  className="bg-cyan-400 hover:bg-cyan-300 text-black text-[10.5px] font-extrabold px-3.5 py-2 rounded-xl"
                >
                  Post
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
