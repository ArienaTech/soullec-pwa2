import { Flame } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
}

export default function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg">
      <Flame className="w-5 h-5" />
      <span>{streak}</span>
    </div>
  );
}
