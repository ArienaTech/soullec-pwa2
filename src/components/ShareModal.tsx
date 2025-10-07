import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Download, Copy, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/lib/use-toast";
import * as htmlToImage from "html-to-image";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function ShareModal({ isOpen, onClose, message }: ShareModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast({
        title: t("copied"),
        description: t("messageCopied"),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failedToCopy"),
        variant: "destructive",
      });
    }
  };

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    try {
      // Create a temporary element for the image
      const element = document.createElement("div");
      element.style.width = "1080px";
      element.style.height = "1080px";
      element.style.padding = "80px";
      element.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      element.style.display = "flex";
      element.style.alignItems = "center";
      element.style.justifyContent = "center";
      element.style.fontFamily = "Dancing Script, cursive";
      element.style.color = "white";
      element.style.textAlign = "center";
      element.style.position = "absolute";
      element.style.top = "-9999px";
      element.innerHTML = `
        <div style="max-width: 800px;">
          <p style="font-size: 48px; line-height: 1.4; margin-bottom: 40px;">${message}</p>
          <p style="font-size: 24px; opacity: 0.8;">✨ Soullec</p>
        </div>
      `;
      
      document.body.appendChild(element);
      
      const dataUrl = await htmlToImage.toPng(element);
      document.body.removeChild(element);
      
      // Download the image
      const link = document.createElement("a");
      link.download = "soullec-message.png";
      link.href = dataUrl;
      link.click();
      
      toast({
        title: t("success"),
        description: t("imageDownloaded"),
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: t("failedToGenerate"),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            {t("shareMessage")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm italic">{message}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleCopyText} variant="outline" className="w-full">
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  {t("copied")}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  {t("copyText")}
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleDownloadImage} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Download className="w-4 h-4 mr-2 animate-spin" />
                  {t("generating")}
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  {t("downloadImage")}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}