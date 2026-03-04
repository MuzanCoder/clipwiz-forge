import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, Zap, Download, Scissors, Monitor, Smartphone, ArrowRight, Shield } from "lucide-react";

const features = [
  { icon: Scissors, title: "Smart Clip Editor", desc: "Precision timeline editor with drag-to-select and instant preview." },
  { icon: Zap, title: "Lightning Fast", desc: "Process and download clips in seconds, not minutes." },
  { icon: Download, title: "Multi-Format Export", desc: "Download in 1080p, 720p, 480p, or extract audio as MP3." },
  { icon: Smartphone, title: "Shorts Generator", desc: "Auto-convert any clip to vertical 9:16 format for Shorts/Reels." },
  { icon: Monitor, title: "Gaming Mode", desc: "Optimized exports for Valorant, CS2, Fortnite highlights." },
  { icon: Shield, title: "Secure & Private", desc: "Your clips are yours. Full encryption and auto-cleanup." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none" style={{ background: "var(--gradient-glow)" }} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Play className="w-4 h-4 text-primary-foreground fill-current" />
          </div>
          <span className="text-lg font-bold text-foreground">ClipForge Pro</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            <Zap className="w-3 h-3" /> Now with Shorts Generator & Gaming Mode
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.1] mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          Clip. Edit.{" "}
          <span className="gradient-text">Download.</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Create and download video clips from YouTube in seconds. Trim, convert to Shorts, and export in any quality — all from your browser.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="glass-card flex items-center rounded-xl px-4 py-3 w-full max-w-md">
            <input
              type="text"
              placeholder="Paste YouTube URL here..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
            />
          </div>
          <Button variant="hero" size="lg" asChild>
            <Link to="/signup">
              Generate Clip <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Preview mockup */}
        <motion.div
          className="glass-card rounded-2xl p-1 max-w-3xl mx-auto glow-effect"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <div className="bg-secondary rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="flex flex-col items-center gap-3 z-10">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <Play className="w-7 h-7 text-primary fill-primary" />
              </div>
              <span className="text-sm text-muted-foreground">See ClipForge Pro in action</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Everything you need to clip like a pro</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">From precise trimming to vertical Shorts — ClipForge Pro handles it all.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass-card rounded-xl p-6 hover-lift cursor-default"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-foreground font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24 text-center">
        <motion.div
          className="glass-card rounded-2xl p-12 glow-effect"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to start clipping?</h2>
          <p className="text-muted-foreground mb-8">Create your free account and start generating clips in seconds.</p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/signup">Get Started Free <ArrowRight className="w-5 h-5" /></Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <Play className="w-3 h-3 text-primary-foreground fill-current" />
            </div>
            <span>ClipForge Pro</span>
          </div>
          <p className="text-center text-xs max-w-md">This tool is for educational purposes only. Users must comply with YouTube's Terms of Service.</p>
          <p>© 2026 ClipForge Pro</p>
        </div>
      </footer>
    </div>
  );
}
