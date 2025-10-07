import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface TarotCardData {
  card: {
    name: string;
    uprightMeaning: string;
    reversedMeaning: string;
    imageUrl?: string;
  };
  position: string;
  reversed: boolean;
}

interface TarotCardProps {
  card: TarotCardData;
  index: number;
  isRevealed?: boolean;
}

export default function TarotCard({ card, index, isRevealed = true }: TarotCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="w-full max-w-xs"
    >
      <Card className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{card.position}</h3>
          <p className="text-2xl font-serif text-center">
            {card.card.name}
            {card.reversed && <span className="text-sm ml-2">(Reversed)</span>}
          </p>
        </div>
        
        <div className="aspect-[2/3] bg-gradient-to-br from-purple-400/20 via-pink-500/20 to-blue-400/20 rounded-lg flex items-center justify-center">
          <div className={`text-6xl ${card.reversed ? "rotate-180" : ""}`}>
            🃏
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          {card.reversed ? card.card.reversedMeaning : card.card.uprightMeaning}
        </p>
      </Card>
    </motion.div>
  );
}
