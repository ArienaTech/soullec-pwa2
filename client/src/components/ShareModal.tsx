import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function ShareModal({ isOpen, onClose, message }: ShareModalProps) {
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(message);
    toast({
      title: "Copied to clipboard!",
      description: "Your message is ready to share",
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
          <div className="p-6 bg-gradient-to-br from-purple-400/20 via-pink-500/20 to-blue-400/20 rounded-lg">
            <p className="text-lg font-serif leading-relaxed">{message}</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCopyToClipboard} className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
