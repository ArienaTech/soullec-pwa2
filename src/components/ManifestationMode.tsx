import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Wand2, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ManifestationModeProps {
  onGenerate: (desire: string) => void;
  affirmation: string;
  isLoading: boolean;
}

export default function ManifestationMode({ onGenerate, affirmation, isLoading }: ManifestationModeProps) {
  const [desire, setDesire] = useState("");
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (desire.trim()) {
      onGenerate(desire.trim());
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="desire" className="text-lg font-medium text-foreground">
            {t("manifestationSubtitle")}
          </label>
          <Textarea
            id="desire"
            placeholder={t("manifestationPlaceholder")}
            value={desire}
            onChange={(e) => setDesire(e.target.value)}
            className="min-h-[120px] resize-none text-base"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={!desire.trim() || isLoading}
          className="w-full h-12 text-base font-medium"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              {t("creating")}
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              {t("createAffirmation")}
            </>
          )}
        </Button>
      </form>

      {affirmation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 md:p-12 bg-gradient-to-br from-purple-400/20 via-pink-500/20 to-rose-400/20 backdrop-blur-xl border-2 border-white/20 rounded-3xl">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <Wand2 className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <p className="text-2xl md:text-3xl font-cursive leading-relaxed text-foreground">
                {affirmation}
              </p>
              <div className="mt-6">
                <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {t("manifestationMode")}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}