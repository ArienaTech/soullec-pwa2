import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface EnergyCardProps {
  message: string;
  emotion: string;
}

export default function EnergyCard({ message, emotion }: EnergyCardProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Card className={`p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-xl bg-gradient-to-br ${gradientClass}`}>
        <p className="text-xl md:text-2xl leading-relaxed text-foreground font-serif">
          {message}
        </p>
      </Card>
    </motion.div>
  );
}
