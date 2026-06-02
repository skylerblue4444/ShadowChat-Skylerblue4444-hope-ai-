import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, TrendingUp, Flame, Sparkles, Image, Send, MoreHorizontal, Bookmark, Flag, Repeat2, Verified } from "lucide-react";
import { FEED_POSTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TABS = ["For You", "Following", "Trending", "Creators"];

function PostCard({ post, index }: { post: typeof FEED_POSTS[0]; index: number }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");

  const handleLike = () => {
    setLiked(p => !p);
    setLikes(p => p + (liked ? -1 : 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] overflow-hidden hover:border-white/[0.12] transition-colors"
    >
      <div className="p-4">
        {/* Author */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {post.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-white">{post.user}</span>
                {post.verified && <Verified className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />}
                {post.trending && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/20 font-mono">TRENDING</span>
                )}
              </div>
              <div className="text-[11px] text-white/40">{post.handle} · {post.time}</div>
            </div>
          </div>
          <button className="p-1 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-white/80 leading-relaxed mb-3">{post.content}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map(tag => (
            <span key={tag} className="text-[10px] text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors">{tag}</span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className={cn("flex items-center gap-1.5 text-[12px] transition-all", liked ? "text-red-400" : "text-white/40 hover:text-red-400")}>
              <Heart className={cn("w-4 h-4 transition-transform active:scale-125", liked && "fill-red-400")} />
              {likes.toLocaleString()}
            </button>
            <button onClick={() => setShowComment(p => !p)} className="flex items-center gap-1.5 text-[12px] text-white/40 hover:text-cyan-400 transition-colors">
              <MessageCircle className="w-4 h-4" />
              {post.comments.toLocaleString()}
            </button>
            <button onClick={() => toast.success("Post shared!")} className="flex items-center gap-1.5 text-[12px] text-white/40 hover:text-green-400 transition-colors">
              <Repeat2 className="w-4 h-4" />
              {post.shares.toLocaleString()}
            </button>
          </div>
          <button onClick={() => setBookmarked(p => !p)} className={cn("p-1 rounded transition-colors", bookmarked ? "text-amber-400" : "text-white/30 hover:text-amber-400")}>
            <Bookmark className={cn("w-4 h-4", bookmarked && "fill-amber-400")} />
          </button>
        </div>
      </div>

      {/* Comment input */}
      <AnimatePresence>
        {showComment && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/[0.06] px-4 py-3 bg-white/[0.02]"
          >
            <div className="flex gap-2">
              <input
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-1.5 text-[12px] text-white placeholder:text-white/30 outline-none focus:border-cyan-500/40"
                onKeyDown={e => {
                  if (e.key === "Enter" && comment.trim()) {
                    toast.success("Comment posted!");
                    setComment("");
                  }
                }}
              />
              <button
                onClick={() => { if (comment.trim()) { toast.success("Comment posted!"); setComment(""); } }}
                className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SocialFeed() {
  const [activeTab, setActiveTab] = useState("For You");
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState(FEED_POSTS);

  const handlePost = () => {
    if (!postText.trim()) return;
    const newPost = {
      id: `p${Date.now()}`,
      user: "Skyler Blue",
      handle: "@skylerblue",
      avatar: "SB",
      verified: true,
      content: postText,
      likes: 0,
      comments: 0,
      shares: 0,
      time: "just now",
      trending: false,
      tags: [],
    };
    setPosts(p => [newPost, ...p]);
    setPostText("");
    toast.success("Post published to feed!");
  };

  return (
    <div className="p-5 max-w-[900px] mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Social Feed</h1>
          <p className="text-[11px] text-white/40">AI-ranked · TikTok × X × Web3</p>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-[11px] text-orange-400 font-mono">24.8K posts today</span>
        </div>
      </div>

      {/* Compose */}
      <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0">SB</div>
          <div className="flex-1">
            <textarea
              value={postText}
              onChange={e => setPostText(e.target.value)}
              placeholder="What's happening in the ShadowChat universe?"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/30 outline-none resize-none min-h-[60px]"
              rows={2}
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-cyan-400 transition-colors">
                  <Image className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-cyan-400 transition-colors">
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handlePost}
                disabled={!postText.trim()}
                className="px-4 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[12px] font-semibold hover:bg-cyan-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-1.5 rounded-md text-[12px] font-medium transition-all",
              activeTab === tab
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/20"
                : "text-white/40 hover:text-white/60"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {posts.map((post, i) => (
          <PostCard key={post.id} post={post as any} index={i} />
        ))}
      </div>
    </div>
  );
}
