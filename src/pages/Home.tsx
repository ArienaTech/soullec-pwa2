import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/use-toast";
import { useAuth } from "@/lib/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { loadStripe } from "@stripe/stripe-js";
import EmotionalInput from "@/components/EmotionalInput";
import EnergyCard from "@/components/EnergyCard";
import ManifestationMode from "@/components/ManifestationMode";
import PaymentModal from "@/components/PaymentModal";
import ShareModal from "@/components/ShareModal";
import StreakBadge from "@/components/StreakBadge";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import TarotCard from "@/components/TarotCard";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Share2, Crown, Wand2, Settings, Stars, Zap, Calendar, Gem, LogIn, LogOut, User } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<"input" | "message" | "manifestation">("input");
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentEmotion, setCurrentEmotion] = useState("");
  const [currentAffirmation, setCurrentAffirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; type: "unlock" | "subscription" }>({
    open: false,
    type: "unlock",
  });
  const [shareModal, setShareModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [soulGems, setSoulGems] = useState<number>(1);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [streak, setStreak] = useState(0);
  const [dailyHoroscope, setDailyHoroscope] = useState<string | null>(null);
  const [loadingHoroscope, setLoadingHoroscope] = useState(false);
  const [showHoroscopeDialog, setShowHoroscopeDialog] = useState(false);
  const [horoscopePeriod, setHoroscopePeriod] = useState<"daily" | "monthly" | "yearly" | "specific">("daily");
  const [horoscopeQuestion, setHoroscopeQuestion] = useState("");
  const [horoscopeDate, setHoroscopeDate] = useState("");
  const [lastHoroscopePeriod, setLastHoroscopePeriod] = useState<"daily" | "monthly" | "yearly" | "specific">("daily");
  const [tarotReading, setTarotReading] = useState<any>(null);
  const [loadingTarot, setLoadingTarot] = useState(false);
  const [tarotQuestion, setTarotQuestion] = useState("");
  const [showTarotDialog, setShowTarotDialog] = useState(false);
  const [tarotQuestionInput, setTarotQuestionInput] = useState("");
  const { toast } = useToast();
  const { t, language } = useLanguage();

  useEffect(() => {
    const initSession = async () => {
      const storedUserId = localStorage.getItem("manifestly-user-id");
      
      // Check if user is authenticated
      if (isAuthenticated && user) {
        const authenticatedId = (user as any).id;
        
        // If we have an anonymous ID, link it to the authenticated account
        if (storedUserId && storedUserId !== authenticatedId) {
          try {
            const linkResponse = await apiRequest("POST", "/api/auth/link", { anonymousId: storedUserId });
            const linkData = await linkResponse.json();
            
            if (linkData.success) {
              // ONLY update localStorage if linking succeeded
              setUserId(authenticatedId);
              localStorage.setItem("manifestly-user-id", authenticatedId);
              setSoulGems(linkData.soulGems ?? 0);
              setIsPremium(linkData.isPremium || false);
              
              toast({
                title: "Account Linked",
                description: "Your gems and history have been transferred to your account!",
              });
              return;
            } else {
              // Linking failed - keep using anonymous ID
              console.error("Failed to link accounts");
              setUserId(storedUserId);
              setSoulGems((user as any).soulGems ?? 0);
              setIsPremium((user as any).subscriptionStatus === "premium");
              return;
            }
          } catch (error) {
            // Linking error - keep using anonymous ID so anonymous flows still work
            console.error("Account linking error:", error);
            if (storedUserId) {
              setUserId(storedUserId);
              // Keep anonymous session working
              const response = await apiRequest("POST", "/api/user/session", { userId: storedUserId });
              const data = await response.json();
              setSoulGems(data.soulGems ?? 1);
              setIsPremium(data.isPremium || false);
            }
            return;
          }
        }
        
        // If already using authenticated ID, just set the state
        setUserId(authenticatedId);
        localStorage.setItem("manifestly-user-id", authenticatedId);
        setSoulGems((user as any).soulGems ?? 0);
        setIsPremium((user as any).subscriptionStatus === "premium");
        return;
      }
      
      // For anonymous users, use session endpoint
      try {
        const response = await apiRequest("POST", "/api/user/session", { userId: storedUserId });
        const data = await response.json();
        
        if (data.userId) {
          setUserId(data.userId);
          localStorage.setItem("manifestly-user-id", data.userId);
          setSoulGems(data.soulGems ?? 1);
          setIsPremium(data.isPremium || false);
        }
      } catch (error) {
        console.error("Session init error:", error);
      }

      const storedStreak = localStorage.getItem("manifestly-streak");
      const lastVisit = localStorage.getItem("manifestly-last-visit");
      const today = new Date().toDateString();

      if (lastVisit === today) {
        setStreak(parseInt(storedStreak || "0", 10));
      } else if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const todayDate = new Date(today);
        const dayDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
          const newStreak = parseInt(storedStreak || "0", 10) + 1;
          setStreak(newStreak);
          localStorage.setItem("manifestly-streak", newStreak.toString());
        } else {
          setStreak(1);
          localStorage.setItem("manifestly-streak", "1");
        }
      } else {
        setStreak(1);
        localStorage.setItem("manifestly-streak", "1");
      }

      localStorage.setItem("manifestly-last-visit", today);
    };

    initSession();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("payment") === "success") {
      toast({
        title: t("paymentSuccessful"),
        description: t("paymentSuccessDesc"),
      });
      window.history.replaceState({}, "", "/");
    }
    if (urlParams.get("subscription") === "success") {
      toast({
        title: t("subscriptionActive"),
        description: t("subscriptionActiveDesc"),
      });
      window.history.replaceState({}, "", "/");
    }
  }, [toast, t, isAuthenticated, user]);

  // Auto-translate tarot reading when language changes
  useEffect(() => {
    const translateTarotReading = async () => {
      if (!tarotReading || !tarotQuestion) return;

      const languageMap: Record<string, string> = {
        en: "English",
        es: "Spanish",
        pt: "Portuguese",
        th: "Thai",
        zh: "Chinese (Simplified)",
        ja: "Japanese",
        ko: "Korean",
        fr: "French",
        de: "German",
        it: "Italian",
        hi: "Hindi",
      };

      try {
        const response = await apiRequest("POST", "/api/tarot/translate", {
          question: tarotQuestion,
          cards: tarotReading.cards,
          spread: tarotReading.spread,
          uiLanguage: languageMap[language] || "English",
          userId: userId,
        });

        const data = await response.json();
        
        if (data.reading && data.advice) {
          setTarotReading({
            ...tarotReading,
            reading: data.reading,
            advice: data.advice,
          });
        }
      } catch (error) {
        console.error("Translation error:", error);
      }
    };

    translateTarotReading();
  }, [language, userId]);

  const handleEmotionalSubmit = async (feeling: string) => {
    if (!userId) {
      toast({
        title: t("error"),
        description: t("sessionNotInitialized"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const uiLanguage = localStorage.getItem("manifestly-ui-language") || "en";
      const languageMap: Record<string, string> = {
        en: "English",
        es: "Spanish",
        pt: "Portuguese",
        th: "Thai",
        zh: "Chinese (Simplified)",
        ja: "Japanese",
        ko: "Korean",
        fr: "French",
        de: "German",
        it: "Italian",
        hi: "Hindi",
      };
      
      const response = await apiRequest("POST", "/api/messages/generate", {
        feeling,
        userId,
        uiLanguage: languageMap[uiLanguage] || "English",
      });
      const data = await response.json();

      if (data.message) {
        setCurrentEmotion(data.emotion || "");
        setCurrentMessage(data.message);
        setMode("message");
        if (typeof data.soulGems === 'number') {
          setSoulGems(data.soulGems);
        }
      } else {
        throw new Error("No message received");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManifestationGenerate = async (desire: string) => {
    if (!userId) {
      toast({
        title: t("error"),
        description: t("sessionNotInitialized"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const uiLanguage = localStorage.getItem("manifestly-ui-language") || "en";
      const languageMap: Record<string, string> = {
        en: "English",
        es: "Spanish",
        pt: "Portuguese",
        th: "Thai",
        zh: "Chinese (Simplified)",
        ja: "Japanese",
        ko: "Korean",
        fr: "French",
        de: "German",
        it: "Italian",
        hi: "Hindi",
      };
      
      const response = await apiRequest("POST", "/api/manifestation/generate", {
        desire,
        userId,
        uiLanguage: languageMap[uiLanguage] || "English",
      });
      const data = await response.json();

      if (data.affirmation) {
        setCurrentAffirmation(data.affirmation);
        if (typeof data.soulGems === 'number') {
          setSoulGems(data.soulGems);
        }
      } else {
        throw new Error("No affirmation received");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate affirmation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHoroscopeDialogOpen = () => {
    if (!userId) {
      toast({
        title: t("error"),
        description: t("sessionNotInitialized"),
        variant: "destructive",
      });
      return;
    }
    setShowHoroscopeDialog(true);
    setHoroscopeQuestion("");
    setHoroscopePeriod("daily");
    setHoroscopeDate("");
  };

  const handleGenerateHoroscope = async () => {
    if (!userId) {
      toast({
        title: t("error"),
        description: t("sessionNotInitialized"),
        variant: "destructive",
      });
      return;
    }

    if (horoscopePeriod === "specific" && !horoscopeDate) {
      toast({
        title: t("error"),
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    setShowHoroscopeDialog(false);
    setLoadingHoroscope(true);

    try {
      const uiLanguage = localStorage.getItem("manifestly-ui-language") || "en";
      const languageMap: Record<string, string> = {
        en: "English",
        es: "Spanish",
        pt: "Portuguese",
        th: "Thai",
        zh: "Chinese (Simplified)",
        ja: "Japanese",
        ko: "Korean",
        fr: "French",
        de: "German",
        it: "Italian",
        hi: "Hindi",
      };
      
      const mappedLanguage = languageMap[uiLanguage] || "English";
      
      const response = await apiRequest("POST", "/api/horoscope/reading", { 
        userId,
        uiLanguage: mappedLanguage,
        period: horoscopePeriod,
        question: horoscopeQuestion || undefined,
        date: horoscopeDate || undefined,
      });
      const data = await response.json();

      if (data.horoscope) {
        setDailyHoroscope(data.horoscope);
        setLastHoroscopePeriod(horoscopePeriod);
        if (typeof data.soulGems === 'number') {
          setSoulGems(data.soulGems);
        }
      } else {
        throw new Error(data.message || "Failed to generate horoscope");
      }
    } catch (error: any) {
      if (error.message?.includes("birth info")) {
        toast({
          title: t("setupRequired"),
          description: t("setupRequiredDesc"),
          action: (
            <Button variant="outline" size="sm" onClick={() => setLocation("/profile")}>
              {t("goToProfile")}
            </Button>
          ),
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to generate horoscope",
          variant: "destructive",
        });
      }
    } finally {
      setLoadingHoroscope(false);
    }
  };

  const handleTarotDialogOpen = () => {
    if (!userId) {
      toast({
        title: t("error"),
        description: t("sessionNotInitialized"),
        variant: "destructive",
      });
      return;
    }
    setShowTarotDialog(true);
    setTarotQuestionInput("");
  };

  const handleTarotReading = async () => {
    if (!tarotQuestionInput.trim()) {
      toast({
        title: t("error"),
        description: t("enterQuestion"),
        variant: "destructive",
      });
      return;
    }

    setShowTarotDialog(false);
    setLoadingTarot(true);
    setTarotQuestion(tarotQuestionInput);

    try {
      const uiLanguage = localStorage.getItem("manifestly-ui-language") || "en";
      const languageMap: Record<string, string> = {
        en: "English",
        es: "Spanish",
        pt: "Portuguese",
        th: "Thai",
        zh: "Chinese (Simplified)",
        ja: "Japanese",
        ko: "Korean",
        fr: "French",
        de: "German",
        it: "Italian",
        hi: "Hindi",
      };

      const response = await apiRequest("POST", "/api/tarot/reading", {
        question: tarotQuestionInput,
        userId,
        uiLanguage: languageMap[uiLanguage] || "English",
        numCards: 3,
      });

      const data = await response.json();

      if (data.reading) {
        setTarotReading(data);
        if (typeof data.soulGems === 'number') {
          setSoulGems(data.soulGems);
        }
      } else {
        throw new Error("No tarot reading received");
      }
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || "Failed to generate tarot reading. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingTarot(false);
    }
  };

  const handleCheckout = async (type: "unlock" | "subscription") => {
    if (!userId) {
      toast({
        title: t("error"),
        description: t("sessionNotInitialized"),
        variant: "destructive",
      });
      return;
    }

    setPaymentModal({ open: false, type });

    try {
      if (type === "subscription") {
        const response = await apiRequest("POST", "/api/payments/subscription", {
          userId,
        });
        const data = await response.json();

        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error("No checkout URL received");
        }
      } else {
        window.location.href = "/checkout";
      }
    } catch (error: any) {
      toast({
        title: t("paymentError"),
        description: error.message || t("paymentFailed"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <StreakBadge streak={streak} />

      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-serif font-bold text-foreground">{t("appName")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocation("/gems")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 hover-elevate active-elevate-2 transition-colors cursor-pointer"
              data-testid="button-gems"
            >
              <Gem className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{isPremium ? "∞" : soulGems}</span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/profile")}
              data-testid="button-profile"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <LanguageSelector />
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.location.href = "/api/logout"}
                  title="Logout"
                  data-testid="button-logout"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.location.href = "/api/login"}
                title="Login for Premium"
                data-testid="button-login"
              >
                <LogIn className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16">
        {mode === "input" && (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
                {t("heroTitle")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("heroSubtitle")}
              </p>
            </div>

            <EmotionalInput onSubmit={handleEmotionalSubmit} isLoading={isLoading} />

            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm text-muted-foreground">{t("or")}</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => setMode("manifestation")}
                variant="secondary"
                className="h-12 px-8"
                data-testid="button-manifestation-mode"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                {t("tryManifestationMode")}
              </Button>

              <Button
                onClick={handleHoroscopeDialogOpen}
                variant="outline"
                className="h-12 px-8"
                disabled={loadingHoroscope}
                data-testid="button-horoscope-reading"
              >
                <Stars className="w-5 h-5 mr-2" />
                {loadingHoroscope ? t("readingStars") : t("horoscopeReading")}
              </Button>

              <Button
                onClick={handleTarotDialogOpen}
                variant="outline"
                className="h-12 px-8"
                disabled={loadingTarot}
                data-testid="button-tarot-reading"
              >
                <Zap className="w-5 h-5 mr-2" />
                {loadingTarot ? t("readingCards") : t("tarotReading")}
              </Button>
            </div>

            <Dialog open={showTarotDialog} onOpenChange={setShowTarotDialog}>
              <DialogContent data-testid="dialog-tarot-question">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    {t("askTarot")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("tarotQuestion")}
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  placeholder={t("tarotQuestionPlaceholder")}
                  value={tarotQuestionInput}
                  onChange={(e) => setTarotQuestionInput(e.target.value)}
                  className="min-h-24"
                  data-testid="input-tarot-question"
                />
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowTarotDialog(false)}
                    data-testid="button-cancel-tarot"
                  >
                    {t("close")}
                  </Button>
                  <Button 
                    onClick={handleTarotReading}
                    data-testid="button-submit-tarot"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t("drawCards")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={showHoroscopeDialog} onOpenChange={setShowHoroscopeDialog}>
              <DialogContent data-testid="dialog-horoscope-reading">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Stars className="w-5 h-5 text-primary" />
                    {t("horoscopeReading")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("horoscopeDialogDesc")}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t("timePeriod")}</label>
                    <Select value={horoscopePeriod} onValueChange={(value: any) => setHoroscopePeriod(value)}>
                      <SelectTrigger data-testid="select-horoscope-period">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">{t("periodDaily")}</SelectItem>
                        <SelectItem value="monthly">{t("periodMonthly")}</SelectItem>
                        <SelectItem value="yearly">{t("periodYearly")}</SelectItem>
                        <SelectItem value="specific">{t("periodSpecific")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {horoscopePeriod === "specific" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t("selectDate")}</label>
                      <Input
                        type="date"
                        value={horoscopeDate}
                        onChange={(e) => setHoroscopeDate(e.target.value)}
                        data-testid="input-horoscope-date"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium mb-2 block">{t("questionOptional")}</label>
                    <Textarea
                      placeholder={t("horoscopeQuestionPlaceholder")}
                      value={horoscopeQuestion}
                      onChange={(e) => setHoroscopeQuestion(e.target.value)}
                      className="min-h-24"
                      data-testid="input-horoscope-question"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowHoroscopeDialog(false)}
                    data-testid="button-cancel-horoscope"
                  >
                    {t("close")}
                  </Button>
                  <Button 
                    onClick={handleGenerateHoroscope}
                    data-testid="button-generate-horoscope"
                  >
                    <Stars className="w-4 h-4 mr-2" />
                    {t("generateReading")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {dailyHoroscope && (
              <div className="mt-8 p-6 bg-card border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Stars className="w-5 h-5 text-primary" />
                  {lastHoroscopePeriod === "daily" && t("yourDailyHoroscope")}
                  {lastHoroscopePeriod === "monthly" && t("yourMonthlyHoroscope")}
                  {lastHoroscopePeriod === "yearly" && t("yourYearlyHoroscope")}
                  {lastHoroscopePeriod === "specific" && t("yourHoroscopeReading")}
                </h3>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {dailyHoroscope}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDailyHoroscope(null)}
                  className="mt-4"
                  data-testid="button-close-horoscope"
                >
                  {t("close")}
                </Button>
              </div>
            )}

            {tarotReading && (
              <div className="mt-8 p-6 bg-gradient-to-br from-card via-card to-purple-900/5 border border-primary/30 rounded-lg shadow-lg">
                <div className="mb-6">
                  <h3 className="text-xl font-serif font-bold mb-2 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    {t("tarotReading")}
                  </h3>
                  <p className="text-sm text-muted-foreground italic">
                    "{tarotQuestion}"
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  {tarotReading.cards?.map((cardData: any, index: number) => (
                    <TarotCard 
                      key={index}
                      card={cardData}
                      index={index}
                      isRevealed={true}
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">
                      {t("tarotInterpretation")}
                    </h4>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {tarotReading.reading}
                    </p>
                  </div>

                  {tarotReading.advice && (
                    <div>
                      <h4 className="font-semibold text-primary mb-2">
                        {t("tarotGuidance")}
                      </h4>
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {tarotReading.advice}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTarotReading(null)}
                  className="mt-6"
                  data-testid="button-close-tarot"
                >
                  {t("close")}
                </Button>
              </div>
            )}
          </div>
        )}

        {mode === "message" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <EnergyCard message={currentMessage} emotion={currentEmotion} />

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={() => {
                  setPaymentModal({ open: true, type: "subscription" });
                }}
                className="flex-1 sm:flex-none min-w-[200px]"
                data-testid="button-subscribe"
              >
                <Crown className="w-4 h-4 mr-2" />
                {t("unlockUnlimited")}
              </Button>

              <Button
                onClick={() => setShareModal(true)}
                variant="secondary"
                className="flex-1 sm:flex-none min-w-[200px]"
                data-testid="button-share-message"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t("shareMyMessage")}
              </Button>
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={() => {
                  setMode("input");
                  setCurrentMessage("");
                  setCurrentEmotion("");
                }}
                variant="ghost"
                data-testid="button-new-message"
              >
                {t("receiveAnotherMessage")}
              </Button>
            </div>
          </div>
        )}

        {mode === "manifestation" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <ManifestationMode
              onGenerate={handleManifestationGenerate}
              affirmation={currentAffirmation}
              isLoading={isLoading}
            />

            <div className="text-center pt-4">
              <Button
                onClick={() => {
                  setMode("input");
                  setCurrentAffirmation("");
                }}
                variant="ghost"
                data-testid="button-back-input"
              >
                {t("backToMessages")}
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>✨ {t("footerText")}</p>
        </div>
      </footer>

      <PaymentModal
        isOpen={paymentModal.open}
        onClose={() => setPaymentModal({ ...paymentModal, open: false })}
        type={paymentModal.type}
        onCheckout={handleCheckout}
      />

      <ShareModal
        isOpen={shareModal}
        onClose={() => setShareModal(false)}
        message={currentMessage}
      />
    </div>
  );
}
