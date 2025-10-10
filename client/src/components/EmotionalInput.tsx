import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface EmotionalInputProps {
  onSubmit: (feeling: string) => void;
  isLoading: boolean;
}

export default function EmotionalInput({ onSubmit, isLoading }: EmotionalInputProps) {
  const [feeling, setFeeling] = useState("");

  const handleSubmit = () => {
    if (feeling.trim()) {
      onSubmit(feeling);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Textarea
        placeholder="What are you feeling today?"
        value={feeling}
        onChange={(e) => setFeeling(e.target.value)}
        className="min-h-[120px] text-lg resize-none"
        disabled={isLoading}
      />
      <Button
        onClick={handleSubmit}
        disabled={isLoading || !feeling.trim()}
        className="w-full h-12 text-base"
        size="lg"
        data-testid="button-reveal-message"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        {isLoading ? "Generating..." : "Reveal My Message"}
      </Button>
    </div>
  );
}
