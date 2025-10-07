import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Stars, Heart, Sparkles } from "lucide-react";

interface EnergyCardProps {
  message: string;
  emotion: string;
  activeSystems?: string[];
  religion?: string;
}

export default function EnergyCard({ message, emotion, activeSystems = [], religion }: EnergyCardProps) {
  const emotionColors: Record<string, string> = {
    hopeful: "from-blue-400/20 via-purple-500/20 to-pink-400/20",
    stressed: "from-red-400/20 via-orange-500/20 to-yellow-400/20",
    "in love": "from-pink-400/20 via-rose-500/20 to-red-400/20",
    lost: "from-gray-400/20 via-slate-500/20 to-blue-400/20",
    grateful: "from-green-400/20 via-emerald-500/20 to-teal-400/20",
    anxious: "from-yellow-400/20 via-amber-500/20 to-orange-400/20",
    peaceful: "from-cyan-400/20 via-teal-500/20 to-green-400/20",
    uncertain: "from-purple-400/20 via-violet-500/20 to-indigo-400/20",
    empowered: "from-yellow-400/20 via-orange-500/20 to-red-400/20",
  };

  const gradientClass = emotionColors[emotion] || emotionColors.uncertain;
  
  const systemNames: Record<string, string> = {
    'western-zodiac': 'Western',
    'vedic': 'Vedic',
    'chinese-bazi': 'Bazi',
    'thai-lanna': 'Thai',
    'japanese': 'Japanese',
    'korean-saju': 'Saju'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Card className={`p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-xl bg-gradient-to-br ${gradientClass}`}>
        {/* System Badges - Show what powered this reading */}
        {(activeSystems.length > 0 || religion) && (
          <div className="mb-6 pb-6 border-b border-foreground/10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-foreground/70" />
              <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                Powered By
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeSystems.map((system) => (
                <div
                  key={system}
                  className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-1.5">
                    <Stars className="w-3 h-3 text-purple-400" />
                    <span className="text-xs font-semibold text-foreground">
                      {systemNames[system] || system}
                    </span>
                  </div>
                </div>
              ))}
              {religion && religion !== "None" && (
                <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-green-400" />
                    <span className="text-xs font-semibold text-foreground">
                      {religion}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <p className="text-xl md:text-2xl leading-relaxed text-foreground font-serif">
          {message}
        </p>
      </Card>
    </motion.div>
  );
}
