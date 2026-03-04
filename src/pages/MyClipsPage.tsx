import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Film, Download, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function MyClipsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clips, setClips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClips = async () => {
    if (!user) return;
    const { data } = await supabase.from("clips").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setClips(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchClips(); }, [user]);

  const deleteClip = async (id: string) => {
    await supabase.from("clips").delete().eq("id", id);
    toast({ title: "Clip deleted" });
    fetchClips();
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">My Clips</h1>
        <p className="text-sm text-muted-foreground mt-1">{clips.length} clips generated</p>
      </motion.div>

      {loading ? (
        <p className="text-muted-foreground text-center py-8">Loading...</p>
      ) : clips.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No clips yet. Go create one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clips.map((clip, i) => (
            <motion.div key={clip.id} className="glass-card rounded-xl overflow-hidden hover-lift" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <div className="aspect-video bg-secondary flex items-center justify-center relative">
                {clip.thumbnail_url ? <img src={clip.thumbnail_url} alt={clip.title} className="w-full h-full object-cover" /> : <Film className="w-8 h-8 text-muted-foreground" />}
                <span className="absolute bottom-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-background/80 text-foreground font-mono">{clip.duration ? `${Math.floor(clip.duration)}s` : "—"}</span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground truncate">{clip.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{new Date(clip.created_at).toLocaleDateString()} • {clip.quality}</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <Download className="w-3 h-3" /> Download
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => deleteClip(clip.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
