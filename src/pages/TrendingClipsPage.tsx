import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Film, Download, Share2, TrendingUp } from "lucide-react";

const trending = [
  { id: "t1", title: "Insane CS2 AWP Flick", author: "ProGamer99", downloads: 1243, duration: "0:28" },
  { id: "t2", title: "Taylor Swift Concert Moment", author: "MusicFan", downloads: 892, duration: "0:45" },
  { id: "t3", title: "AI Explains Quantum Physics", author: "ScienceNerd", downloads: 654, duration: "0:59" },
  { id: "t4", title: "Perfect Golf Swing Analysis", author: "GolfPro", downloads: 445, duration: "0:33" },
  { id: "t5", title: "Minecraft Speedrun Highlight", author: "BlockMaster", downloads: 378, duration: "0:52" },
  { id: "t6", title: "Street Food Compilation", author: "FoodieTravel", downloads: 312, duration: "0:48" },
];

export default function TrendingClipsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" /> Trending Clips
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Popular clips from the community</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trending.map((clip, i) => (
          <motion.div
            key={clip.id}
            className="glass-card rounded-xl overflow-hidden hover-lift"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="aspect-video bg-secondary flex items-center justify-center relative">
              <Film className="w-8 h-8 text-muted-foreground" />
              <span className="absolute bottom-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-background/80 text-foreground font-mono">{clip.duration}</span>
              <span className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium flex items-center gap-1">
                <Download className="w-2.5 h-2.5" /> {clip.downloads}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-foreground truncate">{clip.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">by {clip.author}</p>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Download className="w-3 h-3" /> Download
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                  <Share2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
