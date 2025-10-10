import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Download, Stars, Heart, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  activeSystems?: string[];
  religion?: string;
}

export default function ShareModal({ isOpen, onClose, message, activeSystems = [], religion }: ShareModalProps) {
  const { toast } = useToast();
  
  const systemNames: Record<string, string> = {
    'western-zodiac': 'Western Zodiac',
    'vedic': 'Vedic Astrology',
    'chinese-bazi': 'Chinese Bazi',
    'thai-lanna': 'Thai Lanna',
    'japanese': 'Japanese',
    'korean-saju': 'Korean Saju'
  };

  const handleCopyToClipboard = () => {
    let shareText = `"${message}"\n\n`;
    
    if (activeSystems.length > 0 || religion) {
      shareText += "✨ Personalized with: ";
      const systems = activeSystems.map(s => systemNames[s] || s).join(", ");
      if (activeSystems.length > 0) {
        shareText += systems;
      }
      if (religion && religion !== "None") {
        shareText += (activeSystems.length > 0 ? " + " : "") + `${religion} wisdom`;
      }
      shareText += "\n";
    }
    
    shareText += "\n🔮 Get your personalized reading at Soullec";
    
    navigator.clipboard.writeText(shareText);
    toast({
      title: "Copied to clipboard!",
      description: "Your message is ready to share with system info",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Message
          </DialogTitle>
          <DialogDescription>
            Spread the positive energy with others
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-6 bg-gradient-to-br from-purple-400/20 via-pink-500/20 to-blue-400/20 rounded-lg space-y-4">
            <p className="text-lg font-serif leading-relaxed">{message}</p>
            
            {(activeSystems.length > 0 || religion) && (
              <div className="pt-4 border-t border-foreground/10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3 h-3 text-foreground/70" />
                  <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                    Personalized With
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeSystems.map((system) => (
                    <div
                      key={system}
                      className="px-2 py-1 rounded-full bg-purple-500/20 border border-purple-500/30"
                    >
                      <div className="flex items-center gap-1">
                        <Stars className="w-3 h-3 text-purple-400" />
                        <span className="text-xs font-semibold text-foreground">
                          {systemNames[system] || system}
                        </span>
                      </div>
                    </div>
                  ))}
                  {religion && religion !== "None" && (
                    <div className="px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-green-400" />
                        <span className="text-xs font-semibold text-foreground">
                          {religion}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCopyToClipboard} className="flex-1" data-testid="button-copy-share">
              <Share2 className="w-4 h-4 mr-2" />
              Copy with System Info
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Sharing shows others what makes your reading unique 🌟
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
