import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";

interface ManifestationModeProps {
  onGenerate: (desire: string) => void;
  affirmation: string;
  isLoading: boolean;
}

export default function ManifestationMode({
  onGenerate,
  affirmation,
  isLoading,
}: ManifestationModeProps) {
  const [desire, setDesire] = useState("");

  const handleGenerate = () => {
    if (desire.trim()) {
      onGenerate(desire);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif">Manifestation Mode</h2>
        <p className="text-muted-foreground">
          Share your deepest desire and receive a powerful affirmation
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder="I desire..."
          value={desire}
          onChange={(e) => setDesire(e.target.value)}
          className="min-h-[100px] text-lg resize-none"
          disabled={isLoading}
        />
        <Button
          onClick={handleGenerate}
          disabled={isLoading || !desire.trim()}
          className="w-full h-12"
          size="lg"
          data-testid="button-generate-affirmation"
        >
          <Wand2 className="w-5 h-5 mr-2" />
          {isLoading ? "Manifesting..." : "Generate Affirmation"}
        </Button>
      </div>

      {affirmation && (
        <Card className="p-8 bg-gradient-to-br from-purple-400/20 via-pink-500/20 to-blue-400/20">
          <p className="text-xl md:text-2xl font-serif leading-relaxed text-center">
            {affirmation}
          </p>
        </Card>
      )}
    </div>
  );
}
