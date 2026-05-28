import { useState, useEffect } from "react";
import { MessageSquare, Heart, Share2, Plus, Sparkles, Send, X, Star, ImageIcon, SendToBack } from "lucide-react";
import { CommunityPost, UserProfile } from "../types";
import { SAMPLE_COMM_FEED, SAMPLE_CREATORS } from "../data";
import { EmulatedDatabase } from "../utils/firebaseFallback";
import { motion, AnimatePresence } from "motion/react";

interface CommunityViewProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  onCompleteChallengeAction: (actionType: string) => void;
}

const TEMPLATE_IMAGES = [
  { name: "Gaming Thumbnail", url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80" },
  { name: "Brand Visual Figma", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" },
  { name: "Aesthetic CapCut Cut", url: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=800&q=80" },
  { name: "Clean Coding Snip", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80" }
];

export default function CommunityView({
  profile,
  onUpdateProfile,
  onCompleteChallengeAction,
}: CommunityViewProps) {
  const [feed, setFeed] = useState<CommunityPost[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [newCaption, setNewCaption] = useState("");
  const [selectedTemplateImg, setSelectedTemplateImg] = useState(TEMPLATE_IMAGES[0].url);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  // Sync Community Feed on mount and on database change
  useEffect(() => {
    // Attempt Firestore snapshot subscription if cloud is ready
    const unsubscribeCloud = EmulatedDatabase.startCommunityFeedListener((realtimeFeed) => {
      setFeed(realtimeFeed);
    });

    if (unsubscribeCloud) {
      return () => unsubscribeCloud();
    }

    // Otherwise, fallback to offline local cache sync
    const handleSync = () => {
      const savedFeed = EmulatedDatabase.getCommunityFeed();
      if (savedFeed.length === 0) {
        // Hydrate from sample if empty
        EmulatedDatabase.saveCommunityFeed(SAMPLE_COMM_FEED);
        setFeed(SAMPLE_COMM_FEED);
      } else {
        setFeed(savedFeed);
      }
    };

    handleSync();
    window.addEventListener("skillspark_feed_updated", handleSync);
    return () => window.removeEventListener("skillspark_feed_updated", handleSync);
  }, []);

  const handleToggleLike = (postId: string) => {
    const updated = feed.map((post) => {
      if (post.id === postId) {
        const hasLiked = post.likedBy?.includes(profile.userId);
        let updatedLikedBy = post.likedBy || [];
        let updatedCount = post.likesCount;

        if (hasLiked) {
          updatedLikedBy = updatedLikedBy.filter((uid) => uid !== profile.userId);
          updatedCount = Math.max(0, updatedCount - 1);
        } else {
          updatedLikedBy = [...updatedLikedBy, profile.userId];
          updatedCount += 1;
        }

        // Write directly to Firestore update hook if connected
        EmulatedDatabase.savePostLike(postId, updatedLikedBy, updatedCount);

        return { ...post, likedBy: updatedLikedBy, likesCount: updatedCount };
      }
      return post;
    });

    setFeed(updated);
    EmulatedDatabase.saveCommunityFeed(updated);
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;

    const updated = feed.map((post) => {
      if (post.id === postId) {
        const comments = post.comments || [];
        const newComments = [
          ...comments,
          { author: profile.displayName, text: commentText, time: "Just now" }
        ];
        
        const nextPost = {
          ...post,
          comments: newComments,
          commentsCount: newComments.length
        };
        
        // Write the updated document to help replicate online updates
        if (nextPost.likesCount !== undefined) {
          EmulatedDatabase.savePostLike(postId, nextPost.likedBy || [], nextPost.likesCount);
        }

        return nextPost;
      }
      return post;
    });

    setFeed(updated);
    EmulatedDatabase.saveCommunityFeed(updated);
    setCommentText("");
    setActiveCommentPostId(null);
  };

  const handleSharePost = () => {
    if (!newCaption.trim()) return;

    const newPost: CommunityPost = {
      id: "post_" + Date.now(),
      authorId: profile.userId,
      authorName: profile.displayName,
      authorAvatar: profile.avatar,
      imageUrl: selectedTemplateImg,
      caption: newCaption,
      likesCount: 0,
      likedBy: [],
      commentsCount: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };

    // Save with real-time firestore seeding
    EmulatedDatabase.saveNewCommunityPost(newPost);

    // Reward XP for sharing
    const newXp = profile.xp + 50;
    // Add to user portfolio in profile
    const newPortfolio = [
      { id: newPost.id, title: newCaption.slice(0, 30) + "...", imageUrl: selectedTemplateImg, likes: 0 },
      ...profile.portfolio
    ];

    onUpdateProfile({
      ...profile,
      xp: newXp,
      portfolio: newPortfolio
    });

    // Check Weekly Quest Ticking
    onCompleteChallengeAction("publish_edit");

    // Close Modal and Clear Input
    setNewCaption("");
    setIsShareOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* Header and Call to action */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight font-display">Showcase Feed</h1>
          <p className="text-xs text-neutral-400 mt-0.5">Share thumbnail designs, video feedback, and coding builds.</p>
        </div>

        <button
          onClick={() => setIsShareOpen(true)}
          className="p-3 bg-gradient-to-r from-cyan-400 to-purple-600 text-white font-extrabold rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Trending Creators horizontal section */}
      <div className="space-y-3 bg-[#0A0A0B] p-4 rounded-2xl border border-white/5 shadow-md">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
          Trending Sparks <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/10" />
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
          {SAMPLE_CREATORS.map((creator) => (
            <div key={creator.id} className="flex flex-col items-center shrink-0 min-w-[70px] text-center">
              <div className="w-11 h-11 rounded-full bg-[#050505] border border-white/5 font-bold text-xl flex items-center justify-center mb-1.5 shadow-md">
                {creator.avatar}
              </div>
              <span className="text-[10px] font-bold text-neutral-300 truncate w-16">{creator.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-5">
        {feed.map((post) => {
          const hasLiked = post.likedBy?.includes(profile.userId);

          return (
            <div
              key={post.id}
              className="bg-[#0A0A0B] rounded-3xl border border-white/5 overflow-hidden flex flex-col shadow-lg"
            >
              {/* Post Header */}
              <div className="p-4 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#050505] border border-white/10 font-bold text-lg flex items-center justify-center shrink-0">
                  {post.authorAvatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-100 font-display">{post.authorName}</h4>
                  <p className="text-[8px] text-neutral-500 font-mono mt-0.5">Shared 2h ago</p>
                </div>
              </div>

              {/* Design Image Attachment */}
              <div className="relative aspect-video bg-[#050505] border-y border-white/5 overflow-hidden">
                <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>

              {/* Post Body Descriptor */}
              <div className="p-4.5 space-y-3">
                <p className="text-xs text-[#CACAD2] leading-relaxed font-sans">{post.caption}</p>

                {/* Micro Action Panel (Likes/Comments) */}
                <div className="flex items-center gap-6 text-neutral-400 text-xs pt-1">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className="flex items-center gap-1.5 hover:text-red-400 transition-colors cursor-pointer font-semibold font-display"
                  >
                    <Heart className={`w-4 h-4 ${hasLiked ? "fill-red-500 text-red-500" : ""}`} />
                    <span className={hasLiked ? "text-red-400" : ""}>{post.likesCount}</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer font-semibold font-display"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount}</span>
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer ml-auto">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Interactive Comments Drawer */}
                {(activeCommentPostId === post.id || post.comments && post.comments.length > 0) && (
                  <div className="mt-3 pt-3.5 border-t border-white/5 space-y-2.5 text-[11px]">
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {post.comments?.map((comment, index) => (
                        <div key={index} className="bg-[#050505] p-3 rounded-xl border border-white/5 shadow-inner">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-neutral-100">{comment.author}</span>
                            <span className="text-[8px] text-neutral-500 font-mono">{comment.time}</span>
                          </div>
                          <p className="text-neutral-400 mt-0.5 leading-normal">{comment.text}</p>
                        </div>
                      ))}
                    </div>

                    {activeCommentPostId === post.id && (
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Write feedback, critique, or advice..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                          className="flex-1 bg-[#050505] rounded-xl px-3 py-2 text-xs text-white border border-white/5 placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="p-2 bg-gradient-to-br from-cyan-400 to-purple-600 hover:opacity-90 text-white rounded-xl transition-all shrink-0 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Share New Post Screen Modal overlay */}
      <AnimatePresence>
        {isShareOpen && (
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
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <h3 className="font-bold text-white text-sm font-display">Publish Creative Work</h3>
                <button
                  onClick={() => setIsShareOpen(false)}
                  className="p-1 hover:bg-white/5 text-neutral-450 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Design picker templates */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono block">
                  Pick Portfolio Showcase Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATE_IMAGES.map((img) => (
                    <button
                      key={img.url}
                      onClick={() => setSelectedTemplateImg(img.url)}
                      className={`p-2 rounded-xl text-left border flex items-center gap-1.5 overflow-hidden font-mono text-[9px] font-bold transition-all cursor-pointer ${
                        selectedTemplateImg === img.url
                          ? "bg-cyan-500/10 border-cyan-400 text-cyan-300"
                          : "bg-[#050505] border-white/5 text-neutral-400"
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                      <span className="truncate">{img.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Design Showcase Backdrop */}
              <div className="aspect-video bg-[#050505] border border-white/5 rounded-2xl overflow-hidden relative shadow-inner">
                <img src={selectedTemplateImg} alt="" className="w-full h-full object-cover opacity-80" />
                <span className="absolute bottom-2.5 right-2.5 bg-black/80 px-2 py-0.5 rounded text-[8px] text-neutral-400 font-mono uppercase tracking-wider font-bold border border-white/5">
                  PREVIEW FILE
                </span>
              </div>

              {/* Text Area */}
              <div className="space-y-1">
                <textarea
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Tell other students about your design details, CapCut fonts, or tools. Invite likes and critiques! #tag"
                  className="w-full bg-[#050505] text-xs text-white p-3 rounded-2xl border border-white/5 placeholder-neutral-500 focus:outline-none focus:border-cyan-400 h-20 resize-none transition-all"
                />
              </div>

              <button
                onClick={handleSharePost}
                disabled={!newCaption.trim()}
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-purple-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/25 cursor-pointer font-display disabled:opacity-40"
              >
                Publish to Community Feed (+50 XP)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
