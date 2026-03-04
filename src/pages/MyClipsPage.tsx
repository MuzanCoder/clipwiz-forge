import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Film, Download, Trash2 } from "lucide-react";

const clips = [
  { id: "1", title: "Valorant 1v5 Clutch", duration: "0:42", date: "Mar 3, 2026", quality: "1080p" },
  { id: "2", title: "React Hooks Tutorial Clip", duration: "0:58", date: "Mar 2, 2026", quality: "720p" },
  { id: "3", title: "Lo-fi Beat Drop", duration: "0:31", date: "Mar 1, 2026", quality: "MP3" },
  { id: "4", title: "Fortnite Victory Royale", duration: "0:45", date: "Feb 28, 2026", quality: "1080p" },
  { id: "5", title: "Cooking Tutorial Highlight", duration: "0:55", date: "Feb 27, 2026", quality: "480p" },
];

export default function MyClipsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">My Clips</h1>
        <p className="text-sm text-muted-foreground mt-1">{clips.length} clips generated</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clips.map((clip, i) => (
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
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-foreground truncate">{clip.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{clip.date} • {clip.quality}</p>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Download className="w-3 h-3" /> Download
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
