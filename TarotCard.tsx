import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles, Moon } from "lucide-react";

interface TarotCardProps {
  card?: {
    card: {
      name: string;
      keywords: string[];
    };
    position: string;
    reversed: boolean;
  };
  index?: number;
  isRevealed?: boolean;
  onClick?: () => void;
}

export default function TarotCard({ card, index = 0, isRevealed = false, onClick }: TarotCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (!isRevealed && onClick) {
      onClick();
      setIsFlipped(true);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{ 
        cursor: !isRevealed ? 'pointer' : 'default',
        perspective: "1000px"
      }}
      className="inline-block"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: 1, 
          y: 0
        }}
        transition={{ 
          delay: index * 0.2,
          duration: 0.6
        }}
      >
        <Card 
          className={`relative w-32 h-48 md:w-40 md:h-60 ${
            !isRevealed ? 'hover:scale-105 cursor-pointer' : ''
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped || isRevealed ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.8s ease-in-out"
          }}
        >
        <div 
          className="absolute inset-0 backface-hidden bg-gradient-to-br from-primary/20 via-purple-500/30 to-primary/20 border-2 border-primary/50 rounded-lg flex items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-center p-4">
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-2" />
            <div className="text-sm font-serif text-primary">Manifestly</div>
            <div className="text-xs text-muted-foreground mt-1">Tarot</div>
          </div>
        </div>
        
        <div 
          className="absolute inset-0 backface-hidden bg-gradient-to-br from-card via-card to-accent/10 border-2 border-primary/30 rounded-lg p-3 flex flex-col items-center justify-center"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          {card && (
            <>
              <div className="mb-2">
                <Moon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-sm font-serif text-center font-semibold mb-1">
                {card.card.name}
              </h3>
              <p className="text-xs text-primary font-medium mb-1">
                {card.position}
              </p>
              {card.reversed && (
                <p className="text-xs text-muted-foreground italic">
                  (Reversed)
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-1 justify-center">
                {card.card.keywords.slice(0, 2).map((keyword, i) => (
                  <span 
                    key={i} 
                    className="text-xs px-2 py-1 bg-primary/10 rounded-full text-primary"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
      </motion.div>
    </div>
  );
}
