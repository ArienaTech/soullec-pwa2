import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmotionalInputProps {
  onSubmit: (feeling: string) => void;
  isLoading: boolean;
}

export default function EmotionalInput({ onSubmit, isLoading }: EmotionalInputProps) {
  const [feeling, setFeeling] = useState("");
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feeling.trim()) {
      onSubmit(feeling.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="feeling" className="text-lg font-medium text-foreground">
          {t("whatAreYouFeeling")}
        </label>
        <Textarea
          id="feeling"
          placeholder={t("shareYourThoughts")}
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
          className="min-h-[120px] resize-none text-base"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        disabled={!feeling.trim() || isLoading}
        className="w-full h-12 text-base font-medium"
      >
        {isLoading ? (
          <>
            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
            {t("generating")}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            {t("getMyMessage")}
          </>
        )}
      </Button>
    </form>
  );
}