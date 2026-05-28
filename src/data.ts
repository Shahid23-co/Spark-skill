import { Course, Challenge, CommunityPost, Gig } from "./types";

export const SAMPLE_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Reels & Shorts Editing: CapCut Masterclass",
    category: "Video Editing",
    xpReward: 300,
    badge: "🎬 Flow Master",
    image: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    level: "Beginner",
    mentor: "Editing Wiz Max",
    lessons: [
      { id: "c1-l1", title: "Setup & Timeline Basics", duration: "4:20", xpReward: 50, videoUrl: "https://www.youtube.com/watch?v=kY3jO_Vf-d0" },
      { id: "c1-l2", title: "Modern Retention Cuts & Overlays", duration: "6:45", xpReward: 75, videoUrl: "https://www.youtube.com/watch?v=F3zWv9_a_Kk" },
      { id: "c1-l3", title: "Audio Syncing & Sound Design Tips", duration: "5:10", xpReward: 75, videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sound-wave-on-an-audio-mixer-42352-large.mp4" },
      { id: "c1-l4", title: "Color Grading & Exporting for Reels", duration: "8:15", xpReward: 100, videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-video-editing-timeline-on-computer-screen-40502-large.mp4" }
    ]
  },
  {
    id: "course-2",
    title: "1k Subs Blueprint: YouTube Algorithm Secrets",
    category: "YouTube Growth",
    xpReward: 350,
    badge: "🔥 Algo Hack",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    level: "Beginner",
    mentor: "Tech Creator Kai",
    lessons: [
      { id: "c2-l1", title: "The 3-Second Hook formula", duration: "5:30", xpReward: 75, videoUrl: "https://www.youtube.com/watch?v=co9S7O7h8s4" },
      { id: "c2-l2", title: "Deciphering Audience Retention Charts", duration: "7:10", xpReward: 75, videoUrl: "https://www.youtube.com/watch?v=48-H_tY1m4c" },
      { id: "c2-l3", title: "YouTube Search Optimization Hacks", duration: "8:40", xpReward: 100, videoUrl: "https://www.youtube.com/watch?v=9Ie69M39V0M" },
      { id: "c2-l4", title: "Community Building & Scaling Up", duration: "6:50", xpReward: 100, videoUrl: "https://www.youtube.com/watch?v=n8Ksc8_9V5U" }
    ]
  },
  {
    id: "course-3",
    title: "Prompt Design: Gemini AI workflows",
    category: "AI Tools",
    xpReward: 400,
    badge: "🧠 Prompt King",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=60",
    rating: 5.0,
    level: "Intermediate",
    mentor: "AI Architect Zara",
    lessons: [
      { id: "c3-l1", title: "Introduction to Large Language Models", duration: "5:00", xpReward: 80, videoUrl: "https://www.youtube.com/watch?v=reXG7BvY2w4" },
      { id: "c3-l2", title: "Formatting Prompts for Code & Content", duration: "7:30", xpReward: 100, videoUrl: "https://www.youtube.com/watch?v=mC9GWe0gKy0" },
      { id: "c3-l3", title: "Chaining & System Parameters Control", duration: "9:15", xpReward: 100, videoUrl: "https://www.youtube.com/watch?v=g_wO6_F3SGA" },
      { id: "c3-l4", title: "Automating Tasks & APIs Integration", duration: "11:00", xpReward: 120, videoUrl: "https://www.youtube.com/watch?v=reXG7BvY2w4" }
    ]
  },
  {
    id: "course-4",
    title: "High CTR Thumbnail Design Strategies",
    category: "Thumbnail Design",
    xpReward: 300,
    badge: "👁️ CTR Sniper",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    level: "Beginner",
    mentor: "Designer Leo",
    lessons: [
      { id: "c4-l1", title: "Figma Primitives for Social Graphics", duration: "4:50", xpReward: 60, videoUrl: "https://www.youtube.com/watch?v=JW5unb-6C8E" },
      { id: "c4-l2", title: "Choosing Compelling Font Pairings", duration: "5:55", xpReward: 80, videoUrl: "https://www.youtube.com/watch?v=N6Ics_aNbe0" },
      { id: "c4-l3", title: "High Contrast Background Manipulation", duration: "8:20", xpReward: 80, videoUrl: "https://www.youtube.com/watch?v=N6Ics_aNbe0" },
      { id: "c4-l4", title: "The Rule of Thirds for Thumbnail Faces", duration: "6:40", xpReward: 80, videoUrl: "https://www.youtube.com/watch?v=N6Ics_aNbe0" }
    ]
  },
  {
    id: "course-5",
    title: "React & Tailwind: Make Your First Coding Cash",
    category: "Coding",
    xpReward: 500,
    badge: "💻 Dev Legend",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    level: "Intermediate",
    mentor: "Startup Dev Sarah",
    lessons: [
      { id: "c5-l1", title: "Modern JavaScript and Vite Setup", duration: "6:15", xpReward: 100, videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8" },
      { id: "c5-l2", title: "JSX & Component State Control", duration: "9:50", xpReward: 120, videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8" },
      { id: "c5-l3", title: "Styling Responsive Modules with Tailwind", duration: "11:20", xpReward: 130, videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8" },
      { id: "c5-l4", title: "Deploying Applets to Cloud Solutions", duration: "12:10", xpReward: 150, videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8" }
    ]
  },
  {
    id: "course-6",
    title: "Graphic Design Fundamentals with Figma",
    category: "Graphic Design",
    xpReward: 300,
    badge: "🎨 Palette Pro",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    level: "Beginner",
    mentor: "Artist Elena",
    lessons: [
      { id: "c6-l1", title: "Figma Vector Tools and Alignment", duration: "5:10", xpReward: 70, videoUrl: "https://www.youtube.com/watch?v=JW5unb-6C8E" },
      { id: "c6-l2", title: "Applying Perfect Palette Theories", duration: "6:30", xpReward: 70, videoUrl: "https://www.youtube.com/watch?v=JW5unb-6C8E" },
      { id: "c6-l3", title: "Typography Hierarchies for Mobile", duration: "7:00", xpReward: 80, videoUrl: "https://www.youtube.com/watch?v=JW5unb-6C8E" },
      { id: "c6-l4", title: "Creating Client Logo Deliverables", duration: "7:50", xpReward: 80, videoUrl: "https://www.youtube.com/watch?v=JW5unb-6C8E" }
    ]
  }
];

export const SAMPLE_CHALLENGES: Challenge[] = [
  {
    id: "chal-daily-1",
    title: "First Spark of the Day",
    description: "Launch SkillSpark, look up trending courses and review any AI Roadmap.",
    xpReward: 50,
    type: "daily",
    isCompleted: false,
    timeLeft: "08h 15m",
    icon: "Sparkles"
  },
  {
    id: "chal-daily-2",
    title: "Watch 1 Lesson Video",
    description: "Complete at least one short lesson within any selected skill topic.",
    xpReward: 80,
    type: "daily",
    isCompleted: false,
    timeLeft: "08h 15m",
    icon: "PlayCircle"
  },
  {
    id: "chal-weekly-1",
    title: "The Content Hustler",
    description: "Publish your first creative edit or graphic thumbnail design to the Community Feed.",
    xpReward: 250,
    type: "weekly",
    isCompleted: false,
    timeLeft: "4 days left",
    icon: "Image"
  },
  {
    id: "chal-weekly-2",
    title: "Earn 200 SkillSpark Coins",
    description: "Apply and successfully accept or complete any micro freelance gig in the Earn Zone.",
    xpReward: 300,
    type: "weekly",
    isCompleted: false,
    timeLeft: "4 days left",
    icon: "Coins"
  }
];

export const SAMPLE_CREATORS = [
  { id: "creator-1", name: "Dino_Edit", avatar: "🦖", sub: "1.2k followers" },
  { id: "creator-2", name: "Zara_AI", avatar: "👩‍🚀", sub: "3.4k followers" },
  { id: "creator-3", name: "CodeBro_Jake", avatar: "🛹", sub: "2.1k followers" },
  { id: "creator-4", name: "FigmaPrincess", avatar: "✨", sub: "4.5k followers" }
];

export const SAMPLE_COMM_FEED: CommunityPost[] = [
  {
    id: "post-1",
    authorId: "user-2",
    authorName: "Dino_Edit",
    authorAvatar: "🦖",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60",
    caption: "🚀 Just finished lesson 2 of YouTube retention editing! Designed this thumbnail hook inside Figma using neon shadows context. Ratio is 16:9, tell me if the font is readable! #thumbnail #freelance #vibe",
    likesCount: 42,
    likedBy: [],
    commentsCount: 3,
    comments: [
      { author: "FigmaPrincess", text: "Contrast on the text is absolute gold, super readable!", time: "2h ago" },
      { author: "Zara_AI", text: "Maybe add a tiny drop shadow to the character? Huge CTR potential!", time: "1h ago" },
      { author: "CodeBro_Jake", text: "Clean! Saving this as thumbnail inspiration.", time: "30m ago" }
    ],
    createdAt: "2026-05-27T10:00:00Z"
  },
  {
    id: "post-2",
    authorId: "user-3",
    authorName: "FigmaPrincess",
    authorAvatar: "✨",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",
    caption: "🎨 Brand board designed entirely under Zara's AI Roadmap specifications! Combining cyberpunk color palettes with corporate sleek minimalism. Ready to deploy as a standard client deck! 👩‍💻✨",
    likesCount: 89,
    likedBy: [],
    commentsCount: 2,
    comments: [
      { author: "Dino_Edit", text: "The neon pink against that matte obsidian gray hits different! 🔥", time: "3h ago" },
      { author: "Zara_AI", text: "Roadmap milestone 3 unlocked right here! Proud mentor moment.", time: "2h ago" }
    ],
    createdAt: "2026-05-27T08:30:00Z"
  }
];

export const SAMPLE_GIGS: Gig[] = [
  {
    id: "gig-1",
    title: "Reels Speed-Cuts & CapCut Subtitles",
    description: "Our gaming TikTok channel needs a creator to take a 5-minute raw review video and turn it into a 45-second high-energy Reel with text transitions and emojis.",
    clientName: "CyberForge Gaming LLC",
    payment: 120,
    category: "Video Editing",
    difficulty: "Beginner",
    status: "open",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80"
  },
  {
    id: "gig-2",
    title: "E-Commerce Figma Header Banner",
    description: "Design a desktop and mobile header banner showcasing our new cyberpunk activewear drop. Must use clean layers so we can modify titles later.",
    clientName: "NeoDrop Clothing Co.",
    payment: 200,
    category: "Graphic Design",
    difficulty: "Beginner",
    status: "open",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80"
  },
  {
    id: "gig-3",
    title: "1-Page React Freelance Pricing Applet",
    description: "We require a modular React pricing slider component styled with Tailwind. Must be fully responsive, matching our static product guidelines.",
    clientName: "SaaSify Automations",
    payment: 450,
    category: "Coding",
    difficulty: "Intermediate",
    status: "open",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80"
  },
  {
    id: "gig-4",
    title: "High-CTR Gaming Channel Thumbnails",
    description: "Looking for 3 thumb templates themed around modern survival games. Fonts must be bold, readable, with custom outline presets.",
    clientName: "PixelSurvivor Streams",
    payment: 90,
    category: "Thumbnail Design",
    difficulty: "Beginner",
    status: "open",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80"
  }
];

export const SAMPLE_ACHIEVEMENTS = [
  { id: "ach-1", title: "Spark Activated", desc: "Unlock your very first skill learning course milestone.", icon: "💎", xpRequired: 100 },
  { id: "ach-2", title: "Freelance Novice", desc: "Successfully claim and finish a client gig in the Earn Zone.", icon: "💼", xpRequired: 300 },
  { id: "ach-3", title: "Community Icon", desc: "Receive over 50 combined likes across your design portfolios.", icon: "🌟", xpRequired: 500 },
  { id: "ach-4", title: "AI Futurist", desc: "Configure a personalized career roadmap via the AI Mentor.", icon: "🧠", xpRequired: 200 }
];
