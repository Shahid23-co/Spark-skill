export interface EnhancedInstructor {
  id: string;
  name: string;
  avatar: string;
  followers: string;
  rating: number;
  coursesCount: number;
  isLive: boolean;
  liveStatusText?: string;
  bio: string;
}

export interface SubtitleCue {
  timeStart: number;
  timeEnd: number;
  en: string;
  hi: string;
}

export interface TimelineTrigger {
  time: number;
  title: string;
  description: string;
  type: "tip" | "highlight" | "zoom" | "ai_explain";
  tipContent?: string;
  highlightSelector?: string; // Target descriptive text to overlay
  x?: number; // X offset percentage for target overlay marker
  y?: number; // Y offset percentage
}

export interface PracticeAssignment {
  task: string;
  description: string;
  objective: string;
  sampleFiles: string[];
  xpReward: number;
  coinsReward: number;
  checklist: string[];
}

export interface EnhancedLesson {
  id: string;
  title: string;
  duration: string;
  xpReward: number;
  videoUrl: string;
  stepNumber: number; // Step 1, Step 2, Step 3, Final Project
  stepType: "basics" | "tutorial" | "advanced" | "project";
  stepLabel: string; // e.g. "Step 1: CapCut Workspace & Timelines"
  resources: Array<{ name: string; url: string; size: string; type: string }>;
  subtitles: SubtitleCue[];
  timelineTriggers: TimelineTrigger[];
  assignment?: PracticeAssignment;
  notes?: string;
}

export interface EnhancedCourse {
  id: string;
  title: string;
  category: string;
  xpReward: number;
  badge: string;
  image: string;
  rating: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  mentorName: string;
  lessons: EnhancedLesson[];
}

export const ENHANCED_INSTRUCTORS: Record<string, EnhancedInstructor> = {
  "Editing Wiz Max": {
    id: "inst-1",
    name: "Editing Wiz Max",
    avatar: "🦖",
    followers: "45.8K Followers",
    rating: 4.9,
    coursesCount: 12,
    isLive: true,
    liveStatusText: "Streaming Live QA right now!",
    bio: "Ex-BuzzFeed Video Editor with 8+ years crafting timeline structures that average 70%+ audience retention. Specializes in CapCut and Premiere Pro."
  },
  "Tech Creator Kai": {
    id: "inst-2",
    name: "Tech Creator Kai",
    avatar: "🛹",
    followers: "91.2K Followers",
    rating: 4.8,
    coursesCount: 18,
    isLive: false,
    liveStatusText: "Next stream on Sunday 6 PM",
    bio: "Short-form retention design researcher. kai has scale 3 separate YouTube Shorts channels to over 500k subscribers in under 9 months."
  },
  "AI Architect Zara": {
    id: "inst-3",
    name: "AI Architect Zara",
    avatar: "🚀",
    followers: "135K Followers",
    rating: 5.0,
    coursesCount: 24,
    isLive: true,
    liveStatusText: "Answering prompt doubts in chat!",
    bio: "AI pipeline specialist and prompt designer. Consistently implements LLM scripting tools to automate creative workflows for agencies."
  },
  "Designer Leo": {
    id: "inst-4",
    name: "Designer Leo",
    avatar: "🎨",
    followers: "28.5K Followers",
    rating: 4.7,
    coursesCount: 8,
    isLive: false,
    bio: "Lead UI-UX creative at Sparks Media. Guru of thumbnail psychology, lighting controls, and Figma rapid vector graphics layout."
  },
  "Artist Elena": {
    id: "inst-5",
    name: "Artist Elena",
    avatar: "✨",
    followers: "52.1K Followers",
    rating: 4.8,
    coursesCount: 9,
    isLive: false,
    bio: "Aesthetic branding professional. Specialized in combining color theory palettes, typographic hierarchies, and mobile graphic mockups."
  }
};

export const ENHANCED_COURSES: EnhancedCourse[] = [
  {
    id: "course-capcut",
    title: "CapCut Editing Masterclass: High-Retention Reels",
    category: "Video Editing",
    xpReward: 350,
    badge: "🎬 CapCut Prodigy",
    image: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    level: "Beginner",
    mentorName: "Editing Wiz Max",
    lessons: [
      {
        id: "capcut-l1",
        title: "Learn Interface Basics",
        duration: "3:30",
        xpReward: 60,
        videoUrl: "https://www.youtube.com/watch?v=kY3jO_Vf-d0",
        stepNumber: 1,
        stepType: "basics",
        stepLabel: "Step 1: CapCut UI & Import Workflow",
        resources: [
          { name: "Raw_Aesthetic_Vlog_Clips.zip", url: "#", size: "45.2 MB", type: "zip" },
          { name: "Default_Shorts_Aspect_Ratios.pdf", url: "#", size: "1.4 MB", type: "pdf" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 4, en: "Welcome back! Today we are learning CapCut interface basics.", hi: "वापस स्वागत है! आज हम CapCut इंटरफ़ेस की बुनियादी बातें सीख रहे हैं।" },
          { timeStart: 5, timeEnd: 9, en: "Look at the left area—this is your media import container.", hi: "बाईं ओर देखें - यह आपका मीडिया इम्पोर्ट कंटेनर है।" },
          { timeStart: 10, timeEnd: 15, en: "To import a video, drag your assets right into the browser grid.", hi: "वीडियो इम्पोर्ट करने के लिए, अपनी फ़ाइलों को सीधे ब्राउज़र ग्रिड में खींचें।" },
          { timeStart: 16, timeEnd: 22, en: "Now, let's explore the global timeline below. Drag any clip there to begin.", hi: "अब, नीचे दी गई ग्लोब टाइमलाइन को देखें। शुरू करने के लिए किसी भी क्लिप को वहां खींचें।" }
        ],
        timelineTriggers: [
          { time: 3, title: "💡 Pro Editing Tip", type: "tip", description: "Use the [C] shortcut to make lightning fast cut splits inside CapCut timeline", tipContent: "Ctrl+K or C is the industry golden key." },
          { time: 8, title: "🔍 Interface Zoom", type: "zoom", description: "Focusing on the Import Media panel on top-left.", tipContent: "This works natively using standard drag-drop." },
          { time: 14, title: "🤖 AI Mentor Guide", type: "ai_explain", description: "Max explains spacing", tipContent: "Keeping clips compact avoids boring blank frames that lose viewers instantly." }
        ],
        assignment: {
          task: "Import raw clips and split at 5s",
          description: "Follow the lesson timeline, import the provided raw vlog files into your timeline, trim the beginning and perform an exact split cut at exactly the 05:00 timestamp.",
          objective: "Master CapCut import & cut utilities.",
          sampleFiles: ["raw_vlog_main.mp4", "instructions_doc.pdf"],
          xpReward: 80,
          coinsReward: 40,
          checklist: ["Import at least 1 raw video file", "Position playhead at 05:00", "Use the Split Tool (trash residual frames)"]
        }
      },
      {
        id: "capcut-l2",
        title: "Cut & Transition Tutorial",
        duration: "4:00",
        xpReward: 80,
        videoUrl: "https://www.youtube.com/watch?v=F3zWv9_a_Kk",
        stepNumber: 2,
        stepType: "tutorial",
        stepLabel: "Step 2: J-Cuts & Cinematic Transitions",
        resources: [
          { name: "Audio_Transition_Swooshes.wav", url: "#", size: "8.5 MB", type: "audio" },
          { name: "LUTS_Warm_Aesthetic.cube", url: "#", size: "12 KB", type: "luts" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 4, en: "Now, let us learn modern retention cuts and overlays.", hi: "अब, हम आधुनिक रिटेंशन कट्स और ओवरले सीखेंगे।" },
          { timeStart: 5, timeEnd: 10, en: "A J-Cut is when your audio starts before the video transition.", hi: "जे-कट तब होता है जब आपका ऑडियो वीडियो ट्रांज़िशन से पहले शुरू होता है।" },
          { timeStart: 11, timeEnd: 16, en: "This creates an elite flow, keeping the viewer's brain curious.", hi: "यह एक उत्कृष्ट प्रवाह बनाता है, जिससे दर्शक का दिमाग उत्सुक रहता है।" },
          { timeStart: 17, timeEnd: 22, en: "Add an overlay text to highlight core words. Double clicks inside preview lets you edit.", hi: "मुख्य शब्दों को हाइलाइट करने के लिए ओवरले टेक्स्ट जोड़ें। पूर्वावलोकन के अंदर डबल क्लिक करने से संपादन होता है।" }
        ],
        timelineTriggers: [
          { time: 4, title: "🤖 AI Split Commentary", type: "ai_explain", description: "J-cut benefit detailed.", tipContent: "Audio cues trigger anticipation, causing a 25% increase in retention rate." },
          { time: 12, title: "⚡ Highlight Transition FX", type: "highlight", description: "Highlighting the FX Panel.", tipContent: "Click on 'Transitions' tab on top control bar and drag 'Pull-in' preset." }
        ],
        assignment: {
          task: "Apply J-Cut structure with transition",
          description: "Align your audio track to start exactly 1.5 seconds prior to the secondary visual sequence. Add a soft 'Pull-in' transition.",
          objective: "Master seamless stream sequencing.",
          sampleFiles: ["sequence_a.mp4", "sequence_b.mp4", "impact_swoosh.wav"],
          xpReward: 100,
          coinsReward: 50,
          checklist: ["Verify Audio overlaps Video A", "Apply Pull-In overlay preset transition", "Maintain total length under 30 seconds"]
        }
      },
      {
        id: "capcut-l3",
        title: "Effects & Sound Tutorial",
        duration: "4:20",
        xpReward: 90,
        videoUrl: "https://www.youtube.com/watch?v=co9S7O7h8s4",
        stepNumber: 3,
        stepType: "advanced",
        stepLabel: "Step 3: Overlay Effects & Audio Ducking",
        resources: [
          { name: "Cyberpunk_Soundscapes_Collection.zip", url: "#", size: "32.1 MB", type: "zip" },
          { name: "Overlays_Light_Leaks.mp4", url: "#", size: "18.4 MB", type: "video" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 4, en: "Let's add effects and professional sound design.", hi: "आइए आज हम इफ़ेक्ट्स और पेशेवर साउंड डिज़ाइन से अपनी वीडियो को निखारें।" },
          { timeStart: 5, timeEnd: 9, en: "Drag the background music onto track 2 and apply keyframe volume.", hi: "बैकग्राउंड म्यूज़िक को ट्रैक 2 पर खींचें और कीफ्रेम वॉल्यूम लागू करें।" },
          { timeStart: 10, timeEnd: 15, en: "When the host speaks, duck background music volume down to minus twenty-five VB.", hi: "जब होस्ट बोले, तब बैकग्राउंड म्यूजिक वॉल्यूम को घटाकर माइनस पच्चीस डीबी करें।" }
        ],
        timelineTriggers: [
          { time: 6, title: "🔊 Keyframe Audio Tip", type: "tip", description: "Hold Alt and click on the volume lane of your clip to insert keyframe points.", tipContent: "Allows progressive volume fades." },
          { time: 12, title: "🤖 AI Audio Advice", type: "ai_explain", description: "AI explains ducking ranges.", tipContent: "Host voice should ideally sit at -6dB, while background loops sit at -24dB." }
        ],
        assignment: {
          task: "Duck background score down for host voice",
          description: "Perform manual audio ducking using two keyframes to ensure clear host explanations without music disruption.",
          objective: "Avoid audio clutter.",
          sampleFiles: ["voice_over.wav", "music_loop.mp3"],
          xpReward: 120,
          coinsReward: 60,
          checklist: ["Dampen music by -15dB during voice parts", "Create smooth ramp transitions for volume decrease", "Check vocal clarity score"]
        }
      },
      {
        id: "capcut-l4",
        title: "Final Project: Cinematic CapCut Reel",
        duration: "5:00",
        xpReward: 150,
        videoUrl: "https://www.youtube.com/watch?v=48-H_tY1m4c",
        stepNumber: 4,
        stepType: "project",
        stepLabel: "Step 4: Craft Your Final Cinematic Reel",
        resources: [
          { name: "Complete_Footage_Asset_Pack.zip", url: "#", size: "128.4 MB", type: "zip" },
          { name: "Deliverable_Specs_Cheatsheet.pdf", url: "#", size: "2.1 MB", type: "pdf" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 5, en: "Welcome to your CapCut Final Capstone Project! We will combine everything we learned.", hi: "आपके CapCut फ़ाइनल प्रोजेक्ट में आपका स्वागत है! हम जो कुछ भी सीखे हैं, उसे शामिल करेंगे।" },
          { timeStart: 6, timeEnd: 12, en: "Your task is to craft a modern 30-second vertical aesthetic reel. Make sure to choose a hook.", hi: "आपका काम 30-सेकंड की वर्टिकल रील बनाना है। ध्यान रखें कि हुक का विशेष इस्तेमाल करें।" }
        ],
        timelineTriggers: [
          { time: 3, title: "🎓 Final Capstone Guidance", type: "tip", description: "Use high contrast title layouts and transitions to submit to the community portfolio.", tipContent: "Unlocks the CapCut Prodigy master badge!" }
        ],
        assignment: {
          task: "Complete 30-Sec cinematic reel",
          description: "Put together everything you learnt. Build a highly engaging 30-second mobile reel using raw lifestyle tracks, transition sound swooshes, host voice overlays, captions, and export it for review.",
          objective: "Synthesize complete edit pipeline values.",
          sampleFiles: ["raw_footage_library.zip", "audio_stems.zip"],
          xpReward: 250,
          coinsReward: 150,
          checklist: ["Add 3-second retention hook text", "Sync background loop to transitions", "Apply color grid aesthetic preset"]
        }
      }
    ]
  },
  {
    id: "course-shorts",
    title: "10x Growth Blueprint: Viral YouTube Shorts",
    category: "YouTube Growth",
    xpReward: 400,
    badge: "🔥 Shorts Alchemist",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    level: "Beginner",
    mentorName: "Tech Creator Kai",
    lessons: [
      {
        id: "shorts-l1",
        title: "Learn Interface Basics",
        duration: "4:15",
        xpReward: 70,
        videoUrl: "https://www.youtube.com/watch?v=co9S7O7h8s4",
        stepNumber: 1,
        stepType: "basics",
        stepLabel: "Step 1: Anatomy of YouTube Shorts Algorithm",
        resources: [
          { name: "Algorithm_CheatSheet_2026.pdf", url: "#", size: "2.8 MB", type: "pdf" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 5, en: "Hey creators! Welcome to the 10x viral growth channel guide.", hi: "नमस्कार क्रिएटर्स! 10 गुना वायरल ग्रोथ चैनल गाइड में आपका स्वागत है।" },
          { timeStart: 6, timeEnd: 12, en: "The main key is showing high retention. If your video is under sixty seconds, aim for over ninety percent.", hi: "मुख्य कुंजी उच्च प्रतिधारण (retention) दिखाना है। यदि आपका वीडियो साठ सेकंड से कम है, तो नब्बे प्रतिशत का लक्ष्य रखें।" }
        ],
        timelineTriggers: [
          { time: 5, title: "🤖 AI Retention Explanation", type: "ai_explain", description: "Kai discusses scroll rates.", tipContent: "The 'swipe-away' ratio should remain under thirty percent to unlock wider indexing feeds." }
        ],
        assignment: {
          task: "Write a 3-second dynamic visual hook text",
          description: "Brainstorm 3 diverse visual hooks that attract a passive scroll viewer inside the YouTube feed.",
          objective: "Combat high user scroll-away tendencies.",
          sampleFiles: ["sample_viral_hooks.pdf"],
          xpReward: 70,
          coinsReward: 35,
          checklist: ["Write Hook A focusing on controversy", "Write Hook B focusing on intense curiosity", "Write Hook C focusing on a strong visual result"]
        }
      },
      {
        id: "shorts-l2",
        title: "Cut & Transition Tutorial",
        duration: "5:00",
        xpReward: 80,
        videoUrl: "https://www.youtube.com/watch?v=9Ie69M39V0M",
        stepNumber: 2,
        stepType: "tutorial",
        stepLabel: "Step 2: Structuring the Loop & Retaining Viewers",
        resources: [
          { name: "Loop_Transition_Hacks.pdf", url: "#", size: "1.2 MB", type: "pdf" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 5, en: "Loops are your secret weapon. If your video loops seamlessly, viewers watch twice.", hi: "अविराम लूप्स (seamless loops) आपका गुप्त हथियार हैं। यदि आपका वीडियो सहजता से लूप करता है, तो लोग दोबारा देखते हैं।" }
        ],
        timelineTriggers: [
          { time: 4, title: "💡 Pro Loop Trick", type: "tip", description: "End your last sentence by merging with your opening phrase.", tipContent: "Perfect flow loops trick viewers into an extra 1.5x completion rate." }
        ],
        assignment: {
          task: "Design a loop phrase script",
          description: "Write a short 15-second Shorts commentary script where the last word transitions elegantly into the first sentence.",
          objective: "Maximize view-counts.",
          sampleFiles: ["script_loop_presets.pdf"],
          xpReward: 90,
          coinsReward: 45,
          checklist: ["Verify ending flows into beginning flawlessly", "Ensure script is bold and punchy", "Verify total time is under 20s"]
        }
      },
      {
        id: "shorts-l3",
        title: "Effects & Sound Tutorial",
        duration: "4:30",
        xpReward: 90,
        videoUrl: "https://www.youtube.com/watch?v=n8Ksc8_9V5U",
        stepNumber: 3,
        stepType: "advanced",
        stepLabel: "Step 3: Overlay Gimmicks & Trending Sounds",
        resources: [
          { name: "Trending_Soundtrack_Index.txt", url: "#", size: "3 KB", type: "text" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 5, en: "Now we align overlays, rapid icons, and trending tracks underneath our audio narration.", hi: "अब हम अपने ऑडियो नैरेशन के नीचे ओवरले, तेज़ आइकन और ट्रेंडिंग ट्रैक जोड़ेंगे।" }
        ],
        timelineTriggers: [
          { time: 5, title: "🤖 Sound Design Tactics", type: "ai_explain", description: "Using audio overlays.", tipContent: "Place subtle pop sound effects behind every sticker or subtitle word projection." }
        ],
        assignment: {
          task: "Insert sound cues behind subtitle events",
          description: "Align short high-frequency transient sound effects like pop, swoosh, or clicks precisely under caption card appearances.",
          objective: "Dramatically reduce visual fatigue.",
          sampleFiles: ["sound_package.zip"],
          xpReward: 110,
          coinsReward: 55,
          checklist: ["Place pop sound behind 5 major text entries", "Adjust pop sound volume to -18dB", "Render demo preview"]
        }
      },
      {
        id: "shorts-l4",
        title: "Final Project: Publish 1 Viral Short Outline",
        duration: "5:30",
        xpReward: 150,
        videoUrl: "https://www.youtube.com/watch?v=48-H_tY1m4c",
        stepNumber: 4,
        stepType: "project",
        stepLabel: "Step 4: Launch Your Short Script Proposal",
        resources: [
          { name: "YouTube_Upload_Validation_Kit.zip", url: "#", size: "15.4 MB", type: "zip" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 5, en: "Alright, final project time! We are finalizing a full viral short storyboard for upload.", hi: "ठीक है, अंतिम प्रोजेक्ट का समय! हम अपलोड के लिए एक पूर्ण वायरल शॉर्ट स्टोरीबोर्ड तैयार करेंगे।" }
        ],
        timelineTriggers: [
          { time: 2, title: "🎓 Graduation Advice", type: "tip", description: "Write metadata description focusing on high indexing keywords.", tipContent: "Ensure tags like shorts, shortsfeed, viral correspond correctly." }
        ],
        assignment: {
          task: "Create the Complete Storyboard and Script",
          description: "Create a detailed step-by-step storyboard layout depicting: frame duration, text overlays, visual description cues, and exact loop scripting flow.",
          objective: "Plan viral shorts with surgical structure.",
          sampleFiles: ["storyboard_template.pdf"],
          xpReward: 200,
          coinsReward: 100,
          checklist: ["Incorporate 3 hook ideas", "Include loop integration details", "Map at least 8 subtitle events"]
        }
      }
    ]
  },
  {
    id: "course-thumbnail",
    title: "Thumbnail Psychology: Cracking High CTRs",
    category: "Thumbnail Design",
    xpReward: 300,
    badge: "👁️ Click Magnet",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    level: "Beginner",
    mentorName: "Designer Leo",
    lessons: [
      {
        id: "thumb-l1",
        title: "Learn Interface Basics",
        duration: "3:40",
        xpReward: 60,
        videoUrl: "https://www.youtube.com/watch?v=JW5unb-6C8E",
        stepNumber: 1,
        stepType: "basics",
        stepLabel: "Step 1: Frame Ratios & Basic Color Blocking",
        resources: [
          { name: "Figma_Thumbnail_Grid_Template.fig", url: "#", size: "15.2 MB", type: "figma" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 5, en: "Welcome! Today we master the secret thumb structure inside Figma.", hi: "स्वागत है! आज हम Figma के अंदर गुप्त थंबनेल संरचना में महारत हासिल करेंगे।" }
        ],
        timelineTriggers: [
          { time: 3, title: "💡 Color Blocking Rules", type: "tip", description: "Never place thin text atop bright elements. Use 20% dark layers to block colors.", tipContent: "Saves high contrast levels." }
        ],
        assignment: {
          task: "Set up a Figma 16:9 thumbnail frame",
          description: "Initialize your workspace by targeting standard dimensions: 1280x720, and block a dark matte background with one active color splash point.",
          objective: "Familiarize yourself with canvas sizing rules.",
          sampleFiles: ["dimensions_cheatsheet.pdf"],
          xpReward: 80,
          coinsReward: 40,
          checklist: ["Frame must measure exactly 1280x720 pixels", "Add canvas background filled with rich obsidian color (#0A0A0B)", "Publish layout file"]
        }
      },
      {
        id: "thumb-l2",
        title: "Cut & Transition Tutorial",
        duration: "4:05",
        xpReward: 70,
        videoUrl: "https://www.youtube.com/watch?v=N6Ics_aNbe0",
        stepNumber: 2,
        stepType: "tutorial",
        stepLabel: "Step 2: Portrait Masking & Face Isolation",
        resources: [
          { name: "Human_Expressions_Pack.zip", url: "#", size: "54.0 MB", type: "zip" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 5, en: "Now, learn face masks. The human eye scans smiling or shocked faces first.", hi: "अब, फेस मास्क सीखें। इंसानी आंखें मुस्कुराती या हैरान चेहरे सबसे पहले देखती हैं।" }
        ],
        timelineTriggers: [
          { time: 5, title: "🔍 Isolation Zoom", type: "zoom", description: "Isolating the subject using Vector Pen mask tools.", tipContent: "Allows refined edges, making subjects pop." }
        ],
        assignment: {
          task: "Mask user portrait in high contrast",
          description: "Isolate a high resolution reaction face from our vector pack. Edge contrast must be crisp. Apply a soft white glow behind.",
          objective: "Create professional portrait stickers.",
          sampleFiles: ["raw_portraits.zip"],
          xpReward: 100,
          coinsReward: 50,
          checklist: ["Isolate facial margins smoothly", "Apply Outer Glow layer shader", "Adjust face size to cover 40% of standard frame"]
        }
      },
      {
        id: "thumb-l3",
        title: "Effects & Sound Tutorial",
        duration: "4:45",
        xpReward: 80,
        videoUrl: "https://www.youtube.com/watch?v=N6Ics_aNbe0",
        stepNumber: 3,
        stepType: "advanced",
        stepLabel: "Step 3: Typographic Contrast & Text Sizing",
        resources: [
          { name: "Bold_Display_Fonts_List.txt", url: "#", size: "4 KB", type: "text" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 6, en: "Text must be readable on ultra small mobile screens! Keep text to under four words maximum.", hi: "टेक्स्ट को बहुत छोटे मोबाइल स्क्रीन पर भी पढ़ा जाना चाहिए! शब्दों को अधिकतम चार शब्दों तक ही सीमित रखें।" }
        ],
        timelineTriggers: [
          { time: 4, title: "🤖 AI Contrast Scan", type: "ai_explain", description: "Scanning lettering width.", tipContent: "Fitted display typography (like Montserrat Extra Bold or Outfit) yields the highest click-through ratings." }
        ],
        assignment: {
          task: "Write and align high CTR typography",
          description: "Insert exactly 3 high impact action words. Scale them to occupy the opposite side of your portrait. Apply solid drop shadow.",
          objective: "Perfect visual balance.",
          sampleFiles: ["typography_styles.pdf"],
          xpReward: 110,
          coinsReward: 55,
          checklist: ["Keep text word count to exactly 3 or lower", "Ensure text is fully legible on 100px width mockup", "Apply rich dark shadow layer"]
        }
      },
      {
        id: "thumb-l4",
        title: "Final Project: High CTR Thumbnail Submission",
        duration: "5:15",
        xpReward: 130,
        videoUrl: "https://www.youtube.com/watch?v=N6Ics_aNbe0",
        stepNumber: 4,
        stepType: "project",
        stepLabel: "Step 4: Ultimate Thumbnail Project Reveal",
        resources: [
          { name: "Grading_Assets_Palette.zip", url: "#", size: "12.0 MB", type: "zip" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 5, en: "It's time to submit your graduation thumbnail! Put together the masked face and bold text.", hi: "अपना स्नातक थंबनेल जमा करने का समय आ गया है! हैरान चेहरे और बोल्ड टेक्स्ट को एक साथ लाएं।" }
        ],
        timelineTriggers: [
          { time: 2, title: "🎓 Final Submission Wisdom", type: "tip", description: "Use the built-in mobile outline checker to preview look as standard search cards.", tipContent: "Your artwork gets direct peer review!" }
        ],
        assignment: {
          task: "Upload your completed 1280x720 PNG thumbnail",
          description: "Design a complete YouTube thumbnail matching the title: 'AI Automation: Made Easy'. Combine your masked portrait, blocked colors, drop shadows, and glowing border gradients.",
          objective: "Create ultimate conversion designs ready for export.",
          sampleFiles: ["brief_instructions.txt"],
          xpReward: 180,
          coinsReward: 90,
          checklist: ["Verify aspect ratio is exactly 16:9", "Integrate face reaction portrait with outer glow", "Limit textual titles to 'AI Made Easy'"]
        }
      }
    ]
  },
  {
    id: "course-ai-tools",
    title: "AI Tools for Beginners: Prompts for Content Creators",
    category: "AI Tools",
    xpReward: 320,
    badge: "🧠 AI Alchemist",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    level: "Intermediate",
    mentorName: "AI Architect Zara",
    lessons: [
      {
        id: "ai-l1",
        title: "Introduction to Large Language Models",
        duration: "3:50",
        xpReward: 60,
        videoUrl: "https://www.youtube.com/watch?v=reXG7BvY2w4",
        stepNumber: 1,
        stepType: "basics",
        stepLabel: "Step 1: LLM Core Architectures & Capabilities",
        resources: [
          { name: "AI_Prompt_Playbook.pdf", url: "#", size: "3.5 MB", type: "pdf" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 6, en: "Welcome! Today we unlock how Large Language Models actually process content requests.", hi: "स्वागत है! आज हम जानेंगे कि बड़े भाषा मॉडल वास्तव में कंटेंट अनुरोधों को कैसे प्रोसेस करते हैं।" }
        ],
        timelineTriggers: [
          { time: 4, title: "🤖 AI Architecture tip", type: "ai_explain", description: "Discussing weights and tokens.", tipContent: "Models don't read words—they convert texts into mathematical token mappings." }
        ],
        assignment: {
          task: "Write a simple persona prompt",
          description: "Construct a primary prompt starting template, assigning a professional role and persona to generate structured advice.",
          objective: "Define strong prompt boundaries.",
          sampleFiles: ["persona_examples.docx"],
          xpReward: 70,
          coinsReward: 35,
          checklist: ["Assign clear professional role to the model", "Specify precise formatting instructions", "State negative constraints to restrict off-topic output"]
        }
      },
      {
        id: "ai-l2",
        title: "Formatting Prompts for Code & Content",
        duration: "4:10",
        xpReward: 70,
        videoUrl: "https://www.youtube.com/watch?v=mC9GWe0gKy0",
        stepNumber: 2,
        stepType: "tutorial",
        stepLabel: "Step 2: Structuring Output as Markdown Cards",
        resources: [
          { name: "Markdown_Grammar_Cheatsheet.txt", url: "#", size: "2 KB", type: "text" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 5, en: "To get flawless details, instruct the model using markdown layout guidelines.", hi: "बेहतरीन जानकारी पाने के लिए, मॉडल को मार्कडाउन रूपरेखा दिशानिर्देशों का पालन करने का निर्देश दें।" }
        ],
        timelineTriggers: [
          { time: 3, title: "💡 Markdown Structure Hook", type: "tip", description: "Using tags like # H1 and `- item` forces clean structured layouts.", tipContent: "Prevents conversational text-bloat." }
        ],
        assignment: {
          task: "Create an structured content script",
          description: "Write a complete prompt that requests output solely in markdown tables, highlighting video hook ideas.",
          objective: "Manipulate strict AI output formats.",
          sampleFiles: ["sample_output.txt"],
          xpReward: 90,
          coinsReward: 45,
          checklist: ["Prompt has a clear output type parameter (markdown)", "Asks for tabular details", "Inhibits chat pleasantries"]
        }
      },
      {
        id: "ai-l3",
        title: "Chaining & System Parameters Control",
        duration: "4:40",
        xpReward: 80,
        videoUrl: "https://www.youtube.com/watch?v=g_wO6_F3SGA",
        stepNumber: 3,
        stepType: "advanced",
        stepLabel: "Step 3: Multi-Step Prompt Chaining Workflows",
        resources: [
          { name: "Chain_Parameters_Guide.pdf", url: "#", size: "1.9 MB", type: "pdf" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 5, en: "Chaining involves referencing output from step A inside step B.", hi: "प्रॉम्प्ट चेनिंग का मतलब है स्टेप A के परिणाम को स्टेप B के अंदर उपयोग करना।" }
        ],
        timelineTriggers: [
          { time: 4, title: "🤖 AI Automation Logic", type: "ai_explain", description: "Why chain prompts?", tipContent: "Splitting work into single focused steps maintains model attention, avoiding hallucinated results." }
        ],
        assignment: {
          task: "Draft a 2-step pipeline chain proposal",
          description: "Design a template showcasing: Step 1 (Generates keywords) -> Step 2 (Builds titles from keywords generated in Step 1).",
          objective: "Unlock complex pipeline builds.",
          sampleFiles: ["chaining_framework.rtf"],
          xpReward: 100,
          coinsReward: 50,
          checklist: ["Specify Step 1 target context", "Build Step 2 linkage schema", "Draft custom keywords checklist"]
        }
      },
      {
        id: "ai-l4",
        title: "Final Project: Automating Creator Workflow",
        duration: "5:20",
        xpReward: 140,
        videoUrl: "https://www.youtube.com/watch?v=reXG7BvY2w4",
        stepNumber: 4,
        stepType: "project",
        stepLabel: "Step 4: Ultimate AI Content Assistant",
        resources: [
          { name: "Creator_Prompts_Bundle.zip", url: "#", size: "6.2 MB", type: "zip" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 5, en: "Welcome to your AI Tools capstone project! You will assemble your full automate-agent proposal.", hi: "आपके AI टूल्स प्रोजेक्ट में आपका स्वागत है! आप अपना पूरा ऑटोमेटेड-एजेंट प्रस्ताव तैयार करेंगे।" }
        ],
        timelineTriggers: [
          { time: 2, title: "🎓 Final Capstone Rules", type: "tip", description: "Package your chain templates neatly so others in community can deploy them easily.", tipContent: "Unlocks the AI Alchemist master badge!" }
        ],
        assignment: {
          task: "Build a complete Social Copilot automated prompt suite",
          description: "Write a high-utility prompt suite containing: 1. Idea generator, 2. Script writer, and 3. Thumbnail caption ideas generator. Package it cleanly in text.",
          objective: "Synthesize expert AI automation skills.",
          sampleFiles: ["agent_brief.txt"],
          xpReward: 200,
          coinsReward: 100,
          checklist: ["Include full instructions for all 3 sub-agents", "Add validation variables", "Draft exemplary model answers"]
        }
      }
    ]
  },
  {
    id: "course-mobile-cinematic",
    title: "Mobile Cinematic Video Editing",
    category: "Video Editing",
    xpReward: 380,
    badge: "📱 Phone Kubrick",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    level: "Intermediate",
    mentorName: "Artist Elena",
    lessons: [
      {
        id: "mobile-l1",
        title: "Lighting & Stabilization Basics",
        duration: "3:45",
        xpReward: 60,
        videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        stepNumber: 1,
        stepType: "basics",
        stepLabel: "Step 1: Golden Hour Framing & Camera Holds",
        resources: [
          { name: "Camera_Stabilization_Tips.pdf", url: "#", size: "3.1 MB", type: "pdf" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 5, en: "Hi! Let us unlock how to capture Hollywood-standard films using just our mobile.", hi: "नमस्ते! आइए जानें कि कैसे हम केवल अपने मोबाइल का उपयोग करके हॉलीवुड-स्तर की फ़िल्में बना सकते हैं।" }
        ],
        timelineTriggers: [
          { time: 4, title: "💡 Pro Camera Tip", type: "tip", description: "Enable grid lines inside phone camera settings to maintain symmetrical alignments.", tipContent: "Ensures cinematic Rule of Thirds is met." }
        ],
        assignment: {
          task: "Complete 10-sec steady panning shot",
          description: "Conduct a continuous 10-second horizontal panning video capture, maintaining straight reference horizons.",
          objective: "Eliminate camera shake artifacts.",
          sampleFiles: ["aim_guide.pdf"],
          xpReward: 80,
          coinsReward: 40,
          checklist: ["Lock visual focus on single steady subject", "Take a continuous panning shot from left-to-right", "Maintain frame horizon levels"]
        }
      },
      {
        id: "mobile-l2",
        title: "Creative Dynamic Speed Ramps",
        duration: "4:15",
        xpReward: 70,
        videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        stepNumber: 2,
        stepType: "tutorial",
        stepLabel: "Step 2: Speed Curves & Motion Whipping",
        resources: [
          { name: "Whip_Transitions_SoundEffects.zip", url: "#", size: "14.2 MB", type: "zip" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 5, en: "Speed ramping involves changing motion velocity at specific keyframe marks.", hi: "स्पीड रैम्पिंग का मतलब है कुछ खास कीफ्रेम मार्क्स पर वीडियो की गति को बदलना।" }
        ],
        timelineTriggers: [
          { time: 3, title: "🔍 Dynamic Curve Hook", type: "zoom", description: "Viewing the Speed Curve editor interface.", tipContent: "Curves allow smooth transitions compared to default linear speeds." }
        ],
        assignment: {
          task: "Create a customized speed-ramp sequence",
          description: "Modify speed of a fast moving subject from normal (1x) -> fast forward (5x) -> extreme slow-motion (0.2x).",
          objective: "Inject action pacing style into sequences.",
          sampleFiles: ["speedy_clips.zip"],
          xpReward: 100,
          coinsReward: 50,
          checklist: ["Sequence incorporates 3 distinct speed marks", "Slow transition is extremely fluid", "Includes action whip audio"]
        }
      },
      {
        id: "mobile-l3",
        title: "Mobile Cinematic Color Grading LUTs",
        duration: "4:35",
        xpReward: 80,
        videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        stepNumber: 3,
        stepType: "advanced",
        stepLabel: "Step 3: Mastering Mobile Color Grading Layers",
        resources: [
          { name: "Teal_And_Orange_Mobile_LUTs.zip", url: "#", size: "4.5 MB", type: "zip" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 6, en: "Color grading breathes identity into standard flat camera raw reels.", hi: "कलर ग्रेडिंग हमारे साधारण मोबाइल की वीडियो में एक सिनेमैटिक जान फूंक देती है।" }
        ],
        timelineTriggers: [
          { time: 4, title: "🤖 AI Color Commentary", type: "ai_explain", description: "Why Teal & Orange is popular.", tipContent: "Contrast between cool blues and warm skin tones is biologically pleasing to our brain." }
        ],
        assignment: {
          task: "Grade flat footage with Teal & Orange curves",
          description: "Import Flat.mp4, highlight cyan levels in background shadows and shift warm skin highlights towards soft gold tones.",
          objective: "Apply advanced color contrasts.",
          sampleFiles: ["flat_footage_profile.zip"],
          xpReward: 120,
          coinsReward: 60,
          checklist: ["Increase sky highlights saturation manually", "Adjust skin tone brightness with selective tools", "Apply custom vignette effect"]
        }
      },
      {
        id: "mobile-l4",
        title: "Final Project: Short Sizzling Reel Submission",
        duration: "5:10",
        xpReward: 150,
        videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        stepNumber: 4,
        stepType: "project",
        stepLabel: "Step 4: Ultimate Mobile Short Movie Submission",
        resources: [
          { name: "Graduation_AssetPack_Elite.zip", url: "#", size: "95 MB", type: "zip" }
        ],
        subtitles: [
          { timeStart: 0, timeEnd: 5, en: "Welcome to your graduation project for Mobile Cinematic Video Editing!", hi: "आज मोबाइल सिनेमैटिक वीडियो एडिटिंग के लिए आपके ग्रेजुएशन प्रोजेक्ट में आपका स्वागत है!" }
        ],
        timelineTriggers: [
          { time: 3, title: "🎓 Final Sizzle Strategy", type: "tip", description: "Export flat at 4K 24FPS to give that classic theater look.", tipContent: "Phone Kubrick credentials unlocked!" }
        ],
        assignment: {
          task: "Upload a finished 15-sec cinematic commercial vertical video",
          description: "Capture, stabilize, speed curve edit, color grade, and export a 15-second teaser clip demonstrating cinematic mobile aesthetics.",
          objective: "Merge all cinematic mobile tricks.",
          sampleFiles: ["project_guidelines.txt"],
          xpReward: 200,
          coinsReward: 100,
          checklist: ["Stabilized motion pacing throughout", "Applied color presets and keyframe audio dips", "Video length sits within 15-20 seconds"]
        }
      }
    ]
  }
];
