import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface EnergyCardProps {
  message: string;
  emotion: string;
}

export default function EnergyCard({ message, emotion }: EnergyCardProps) {
  const emotionColors = {
    hopeful: "from-yellow-400/20 via-orange-500/20 to-pink-400/20",
    stressed: "from-blue-400/20 via-purple-500/20 to-indigo-400/20",
    "in love": "from-pink-400/20 via-rose-500/20 to-red-400/20",
    lost: "from-gray-400/20 via-slate-500/20 to-zinc-400/20",
    grateful: "from-green-400/20 via-emerald-500/20 to-teal-400/20",
    anxious: "from-purple-400/20 via-violet-500/20 to-blue-400/20",
    peaceful: "from-cyan-400/20 via-sky-500/20 to-blue-400/20",
    uncertain: "from-amber-400/20 via-yellow-500/20 to-orange-400/20",
    empowered: "from-purple-400/20 via-pink-500/20 to-rose-400/20",
  };

  const gradientClass = emotionColors[emotion as keyof typeof emotionColors] || emotionColors.peaceful;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className={`relative p-8 md:p-12 backdrop-blur-xl shadow-2xl rounded-3xl border-2 bg-gradient-to-br ${gradientClass} border-white/20`}>
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-2xl md:text-3xl font-cursive leading-relaxed text-center text-foreground">
            {message}
          </p>
          <div className="mt-6 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium capitalize">
              {emotion}
            </span>
          </div>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      </Card>
    </motion.div>
  );
}