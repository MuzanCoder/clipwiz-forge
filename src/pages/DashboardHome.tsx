import { motion } from "framer-motion";
import { Film, Download, TrendingUp, Clock } from "lucide-react";

const stats = [
  { label: "Total Clips", value: "24", icon: Film, change: "+3 this week" },
  { label: "Downloads", value: "156", icon: Download, change: "+12 today" },
  { label: "Trending Clips", value: "5", icon: TrendingUp, change: "2 new" },
  { label: "Processing Time", value: "~8s", icon: Clock, change: "avg" },
];

const recentClips = [
  { title: "Best Valorant Ace Ever", duration: "0:42", date: "2 hours ago", status: "ready" },
  { title: "React Tutorial Highlight", duration: "0:58", date: "Yesterday", status: "ready" },
  { title: "Music Video Chorus", duration: "0:31", date: "3 days ago", status: "ready" },
];

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Welcome back! 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your clips.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="glass-card rounded-xl p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent */}
      <motion.div
        className="glass-card rounded-xl p-5"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Clips</h3>
        <div className="space-y-3">
          {recentClips.map(clip => (
            <div key={clip.title} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Film className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{clip.title}</p>
                  <p className="text-xs text-muted-foreground">{clip.duration} • {clip.date}</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{clip.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
