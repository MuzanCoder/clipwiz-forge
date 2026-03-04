import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Film, Download, TrendingUp, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardHome() {
  const { user, profile } = useAuth();
  const [clipCount, setClipCount] = useState(0);
  const [recentClips, setRecentClips] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("clips").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => {
        setRecentClips(data || []);
        setClipCount(data?.length || 0);
      });
  }, [user]);

  const stats = [
    { label: "Total Clips", value: String(clipCount), icon: Film, change: "from your library" },
    { label: "Downloads", value: "0", icon: Download, change: "total" },
    { label: "Trending Clips", value: "—", icon: TrendingUp, change: "public" },
    { label: "Processing Time", value: "~8s", icon: Clock, change: "avg" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {profile?.name || "User"}! 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your clips.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} className="glass-card rounded-xl p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
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

      <motion.div className="glass-card rounded-xl p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Clips</h3>
        {recentClips.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No clips yet. Create your first clip!</p>
        ) : (
          <div className="space-y-3">
            {recentClips.map(clip => (
              <div key={clip.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Film className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{clip.title}</p>
                    <p className="text-xs text-muted-foreground">{clip.quality} • {new Date(clip.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">ready</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
