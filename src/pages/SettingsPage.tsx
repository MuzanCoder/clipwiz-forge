import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Trash2, BarChart3 } from "lucide-react";

export default function SettingsPage() {
  const user = JSON.parse(localStorage.getItem("clipforge_user") || '{"name":"User","email":"user@example.com"}');
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSave = () => {
    localStorage.setItem("clipforge_user", JSON.stringify({ name, email }));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile and preferences.</p>
      </motion.div>

      {/* Profile */}
      <motion.div className="glass-card rounded-xl p-5 space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Profile</h3>
        </div>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="mt-1 bg-secondary border-border" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 bg-secondary border-border" />
          </div>
          <Button variant="hero" size="sm" onClick={handleSave}>Save Changes</Button>
        </div>
      </motion.div>

      {/* Usage */}
      <motion.div className="glass-card rounded-xl p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Usage Statistics</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-secondary rounded-lg p-3">
            <p className="text-xl font-bold text-foreground">24</p>
            <p className="text-xs text-muted-foreground">Clips Created</p>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <p className="text-xl font-bold text-foreground">156</p>
            <p className="text-xs text-muted-foreground">Downloads</p>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <p className="text-xl font-bold text-foreground">12 min</p>
            <p className="text-xs text-muted-foreground">Total Duration</p>
          </div>
        </div>
      </motion.div>

      {/* Danger */}
      <motion.div className="glass-card rounded-xl p-5 border-destructive/20" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Delete Account</h3>
            <p className="text-xs text-muted-foreground">Permanently delete your account and all data.</p>
          </div>
        </div>
        <Button variant="destructive" size="sm" className="mt-3">Delete Account</Button>
      </motion.div>
    </div>
  );
}
