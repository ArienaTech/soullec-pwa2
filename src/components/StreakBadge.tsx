import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="fixed top-4 right-4 z-50"
    >
      <Badge 
        variant="secondary" 
        className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg"
      >
        <Flame className="w-4 h-4" />
        <span className="font-bold">{streak}</span>
      </Badge>
    </motion.div>
  );
}