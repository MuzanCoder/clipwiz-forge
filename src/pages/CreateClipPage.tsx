import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search, Play, Scissors, Download, Loader2, Gamepad2, Smartphone, Film } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Phase = "input" | "preview" | "processing" | "done";

const qualities = [
  { label: "1080p", size: "~45 MB" },
  { label: "720p", size: "~28 MB" },
  { label: "480p", size: "~15 MB" },
  { label: "360p", size: "~8 MB" },
  { label: "144p", size: "~3 MB" },
  { label: "MP3", size: "~2 MB" },
];

export default function CreateClipPage() {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [startTime, setStartTime] = useState(30);
  const [endTime, setEndTime] = useState(60);
  const [gamingMode, setGamingMode] = useState(false);
  const [shortsMode, setShortsMode] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [clipFilename, setClipFilename] = useState("clip");
  const [error, setError] = useState<string | null>(null);

  const handleFetch = () => {
    if (!url.trim()) return;
    setPhase("preview");
  };

  const handleGenerate = async () => {
    if (!session?.access_token) {
      toast({ title: "Please log in first", variant: "destructive" });
      return;
    }

    setPhase("processing");
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("process-clip", {
        body: {
          url,
          quality: selectedQuality,
          title: `Clip from ${new URL(url).hostname}`,
          startTime,
          endTime,
          isPublic: false,
          shortsMode,
          gamingMode,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setDownloadUrl(data.downloadUrl);
      setClipFilename(data.filename || "clip");
      setPhase("done");
    } catch (err: any) {
      console.error("Process clip error:", err);
      setError(err.message || "Something went wrong");
      setPhase("preview");
      toast({ title: "Failed to process clip", description: err.message, variant: "destructive" });
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = clipFilename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setPhase("input");
    setUrl("");
    setDownloadUrl(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Create Clip</h1>
        <p className="text-sm text-muted-foreground mt-1">Paste a YouTube URL, trim, and download.</p>
      </motion.div>

      {/* URL Input */}
      <motion.div className="glass-card rounded-xl p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Label className="text-xs text-muted-foreground mb-2 block">YouTube URL</Label>
        <div className="flex gap-3">
          <Input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="bg-secondary border-border flex-1"
            disabled={phase !== "input"}
          />
          {phase === "input" ? (
            <Button variant="hero" onClick={handleFetch} disabled={!url.trim()}>
              <Search className="w-4 h-4" /> Fetch
            </Button>
          ) : (
            <Button variant="outline" onClick={handleReset}>Reset</Button>
          )}
        </div>
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Preview phase */}
        {phase === "preview" && (
          <motion.div key="preview" className="space-y-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {/* Video info */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex gap-4">
                <div className="w-40 h-24 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Play className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground truncate max-w-md">{url}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Ready to process</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-primary" /> Clip Editor
              </h3>
              <div className="space-y-4">
                <div className="h-12 bg-secondary rounded-lg relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 bg-primary/20 border-l-2 border-r-2 border-primary rounded"
                    style={{ left: `${(startTime / 330) * 100}%`, width: `${((endTime - startTime) / 330) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-0.5 px-2">
                    {Array.from({ length: 80 }).map((_, i) => (
                      <div key={i} className="w-0.5 bg-muted-foreground/30 rounded-full" style={{ height: `${Math.random() * 60 + 20}%` }} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Start Time (s)</Label>
                    <Input type="number" value={startTime} onChange={e => setStartTime(+e.target.value)} min={0} max={endTime - 1} className="mt-1 bg-secondary border-border" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">End Time (s)</Label>
                    <Input type="number" value={endTime} onChange={e => setEndTime(+e.target.value)} min={startTime + 1} max={330} className="mt-1 bg-secondary border-border" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Clip duration: {endTime - startTime}s (max 60s)</p>
              </div>
            </div>

            {/* Options */}
            <div className="glass-card rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">Export Options</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {qualities.map(q => (
                  <button
                    key={q.label}
                    onClick={() => setSelectedQuality(q.label)}
                    className={`rounded-lg p-3 text-center border transition-all text-sm ${selectedQuality === q.label ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground hover:border-muted-foreground"}`}
                  >
                    <span className="font-medium block">{q.label}</span>
                    <span className="text-[10px] block mt-0.5 opacity-70">{q.size}</span>
                  </button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="flex items-center gap-3 glass-card rounded-lg px-4 py-3 flex-1">
                  <Smartphone className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Shorts Version</p>
                    <p className="text-[11px] text-muted-foreground">Convert to 9:16 vertical</p>
                  </div>
                  <Switch checked={shortsMode} onCheckedChange={setShortsMode} />
                </div>
                <div className="flex items-center gap-3 glass-card rounded-lg px-4 py-3 flex-1">
                  <Gamepad2 className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Gaming Mode</p>
                    <p className="text-[11px] text-muted-foreground">Optimized for gameplay</p>
                  </div>
                  <Switch checked={gamingMode} onCheckedChange={setGamingMode} />
                </div>
              </div>
            </div>

            <Button variant="glow" size="lg" className="w-full" onClick={handleGenerate}>
              <Scissors className="w-4 h-4" /> Generate Clip
            </Button>
          </motion.div>
        )}

        {/* Processing */}
        {phase === "processing" && (
          <motion.div key="processing" className="glass-card rounded-xl p-12 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Processing your clip...</h3>
            <p className="text-sm text-muted-foreground">Downloading from YouTube via Cobalt...</p>
            <div className="mt-6 h-2 bg-secondary rounded-full overflow-hidden max-w-xs mx-auto">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "90%" }}
                transition={{ duration: 8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

        {/* Done */}
        {phase === "done" && (
          <motion.div key="done" className="glass-card rounded-xl p-8 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Film className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Your clip is ready! 🎉</h3>
            <p className="text-sm text-muted-foreground mb-6">Quality: {selectedQuality} • Duration: {endTime - startTime}s {shortsMode && "• Shorts"} {gamingMode && "• Gaming Mode"}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="hero" size="lg" onClick={handleDownload}>
                <Download className="w-4 h-4" /> Download Clip
              </Button>
              <Button variant="outline" size="lg" onClick={handleReset}>
                Create Another
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
