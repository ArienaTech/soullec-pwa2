import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
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
import { Sparkles, Share2, Crown, Wand2, Settings, Stars, Zap, Calendar, Gem, LogIn, LogOut, User, Info, X, ChevronRight, Award, Heart } from "lucide-react";

// Only initialize Stripe if we have a valid key
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = stripePublicKey && stripePublicKey.startsWith('pk_') 
  ? loadStripe(stripePublicKey) 
  : null;

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
  
  // Horoscope Reading2 states
  const [dailyHoroscope2, setDailyHoroscope2] = useState<string | null>(null);
  const [loadingHoroscope2, setLoadingHoroscope2] = useState(false);
  const [showHoroscopeDialog2, setShowHoroscopeDialog2] = useState(false);
  const [horoscopePeriod2, setHoroscopePeriod2] = useState<"daily" | "monthly" | "yearly" | "specific">("daily");
  const [horoscopeQuestion2, setHoroscopeQuestion2] = useState("");
  const [horoscopeDate2, setHoroscopeDate2] = useState("");
  const [lastHoroscopePeriod2, setLastHoroscopePeriod2] = useState<"daily" | "monthly" | "yearly" | "specific">("daily");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [profileBannerDismissed, setProfileBannerDismissed] = useState(false);
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
    
    // Check if this is first visit
    const hasSeenWelcome = localStorage.getItem("manifestly-seen-welcome");
    if (!hasSeenWelcome) {
      setTimeout(() => setShowWelcomeModal(true), 1000);
      localStorage.setItem("manifestly-seen-welcome", "true");
    }
  }, [toast, t, isAuthenticated, user]);
  
  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/user/profile/${userId}`);
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchUserProfile();
  }, [userId]);

  
  // Profile completion helpers
  const isProfileComplete = userProfile?.birthDate && userProfile?.horoscopePreferences?.length > 0;
  const activeSystems = userProfile?.horoscopePreferences?.length || 0;
  const hasReligion = !!userProfile?.religion && userProfile?.religion !== "None";
  const profileCompletionPercentage = Math.round(
    ((userProfile?.birthDate ? 33 : 0) +
    (userProfile?.horoscopePreferences?.length > 0 ? 34 : 0) +
    (userProfile?.religion && userProfile?.religion !== "None" ? 33 : 0))
  );

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

  const handleHoroscopeDialogOpen2 = () => {
    if (!userId) {
      toast({
        title: t("error"),
        description: t("sessionNotInitialized"),
        variant: "destructive",
      });
      return;
    }
    setShowHoroscopeDialog2(true);
    setHoroscopeQuestion2("");
    setHoroscopePeriod2("daily");
    setHoroscopeDate2("");
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

  const handleGenerateHoroscope2 = async () => {
    if (!userId) {
      toast({
        title: t("error"),
        description: t("sessionNotInitialized"),
        variant: "destructive",
      });
      return;
    }

    if (horoscopePeriod2 === "specific" && !horoscopeDate2) {
      toast({
        title: t("error"),
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    setShowHoroscopeDialog2(false);
    setLoadingHoroscope2(true);

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
      
      const response = await apiRequest("POST", "/api/horoscope/reading2", { 
        userId,
        uiLanguage: mappedLanguage,
        period: horoscopePeriod2,
        question: horoscopeQuestion2 || undefined,
        date: horoscopeDate2 || undefined,
      });
      const data = await response.json();

      if (data.horoscope) {
        setDailyHoroscope2(data.horoscope);
        setLastHoroscopePeriod2(horoscopePeriod2);
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
      setLoadingHoroscope2(false);
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
      {/* <StreakBadge streak={streak} /> */}

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
            
            {/* Active Systems Badge */}
            {activeSystems > 0 && (
              <button
                onClick={() => setLocation("/profile")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors cursor-pointer"
                title={`${activeSystems} astrology systems active`}
              >
                <Stars className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-semibold text-foreground">{activeSystems}x</span>
              </button>
            )}
            
            {/* Religion Badge */}
            {hasReligion && (
              <button
                onClick={() => setLocation("/profile")}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors cursor-pointer"
                title={`${userProfile.religion} wisdom integrated`}
              >
                <Heart className="w-4 h-4 text-green-500" />
                <span className="text-xs font-semibold text-foreground">{userProfile.religion}</span>
              </button>
            )}
            
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
        {/* Profile Setup Banner */}
        {!isProfileComplete && !profileBannerDismissed && (
          <div className="max-w-4xl mx-auto mb-8 relative">
            <div className="p-5 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 border border-purple-500/30 rounded-xl shadow-lg backdrop-blur-sm">
              <button
                onClick={() => setProfileBannerDismissed(true)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-background/50 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="p-3 rounded-full bg-purple-500/20">
                  <Award className="w-8 h-8 text-purple-500" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      ✨ Unlock Ultra-Personalized Cosmic Readings
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get messages powered by <strong>6 astrology systems</strong> (Western, Vedic, Chinese Bazi, Thai Lanna, Japanese, Korean Saju) + your spiritual path
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Profile Completion</span>
                        <span className="font-semibold">{profileCompletionPercentage}%</span>
                      </div>
                      <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                          style={{ width: `${profileCompletionPercentage}%` }}
                        />
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => setLocation("/profile")}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Complete Setup (2 min)
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  
                  {activeSystems > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                      ✓ {activeSystems} {activeSystems === 1 ? 'system' : 'systems'} already active! {hasReligion && `✓ ${userProfile.religion} wisdom enabled!`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
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
                onClick={handleHoroscopeDialogOpen2}
                variant="outline"
                className="h-12 px-8"
                disabled={loadingHoroscope2}
                data-testid="button-horoscope-reading2"
              >
                <Stars className="w-5 h-5 mr-2" />
                {loadingHoroscope2 ? t("readingStars") : t("horoscopeReading2")}
              </Button>

            </div>

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

            <Dialog open={showHoroscopeDialog2} onOpenChange={setShowHoroscopeDialog2}>
              <DialogContent data-testid="dialog-horoscope-reading2">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Stars className="w-5 h-5 text-primary" />
                    {t("horoscopeReading2")}
                  </DialogTitle>
                  <DialogDescription>
                    {t("horoscopeDialogDesc")}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">{t("timePeriod")}</label>
                    <Select value={horoscopePeriod2} onValueChange={(value: any) => setHoroscopePeriod2(value)}>
                      <SelectTrigger data-testid="select-horoscope-period2">
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

                  {horoscopePeriod2 === "specific" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t("selectDate")}</label>
                      <Input
                        type="date"
                        value={horoscopeDate2}
                        onChange={(e) => setHoroscopeDate2(e.target.value)}
                        data-testid="input-horoscope-date2"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium mb-2 block">{t("questionOptional")}</label>
                    <Textarea
                      placeholder={t("horoscopeQuestionPlaceholder")}
                      value={horoscopeQuestion2}
                      onChange={(e) => setHoroscopeQuestion2(e.target.value)}
                      className="min-h-24"
                      data-testid="input-horoscope-question2"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowHoroscopeDialog2(false)}
                    data-testid="button-cancel-horoscope2"
                  >
                    {t("close")}
                  </Button>
                  <Button 
                    onClick={handleGenerateHoroscope2}
                    data-testid="button-generate-horoscope2"
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

            {dailyHoroscope2 && (
              <div className="mt-8 p-6 bg-card border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Stars className="w-5 h-5 text-primary" />
                  {lastHoroscopePeriod2 === "daily" && t("yourDailyHoroscope")} (2)
                  {lastHoroscopePeriod2 === "monthly" && t("yourMonthlyHoroscope")} (2)
                  {lastHoroscopePeriod2 === "yearly" && t("yourYearlyHoroscope")} (2)
                  {lastHoroscopePeriod2 === "specific" && t("yourHoroscopeReading")} (2)
                </h3>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {dailyHoroscope2}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDailyHoroscope2(null)}
                  className="mt-4"
                  data-testid="button-close-horoscope2"
                >
                  {t("close")}
                </Button>
              </div>
            )}

          </div>
        )}

        {mode === "message" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <EnergyCard 
              message={currentMessage} 
              emotion={currentEmotion}
              activeSystems={userProfile?.horoscopePreferences || []}
              religion={userProfile?.religion}
            />

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
        activeSystems={userProfile?.horoscopePreferences || []}
        religion={userProfile?.religion}
      />
      
      {/* Welcome Modal - First Visit */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Welcome to Soullec - The World's Most Personalized Astrology App
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              Unlike other apps that only offer Western astrology, Soullec combines <strong>6 ancient wisdom traditions</strong> to create readings that feel impossibly personal:
            </p>
            
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-start gap-2">
                  <Stars className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm">Western Zodiac</h4>
                    <p className="text-xs text-muted-foreground">Sun signs, elements, planets</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-start gap-2">
                  <Stars className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm">Vedic Astrology</h4>
                    <p className="text-xs text-muted-foreground">27 Nakshatras, Moon signs</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-start gap-2">
                  <Stars className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm">Chinese Bazi</h4>
                    <p className="text-xs text-muted-foreground">Four Pillars of Destiny</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <Stars className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm">Thai Lanna</h4>
                    <p className="text-xs text-muted-foreground">Weekday deities & animals</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                <div className="flex items-start gap-2">
                  <Stars className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm">Japanese</h4>
                    <p className="text-xs text-muted-foreground">Animal years, blood types</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-2">
                  <Stars className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm">Korean Saju</h4>
                    <p className="text-xs text-muted-foreground">사주 Four Pillars</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
              <div className="flex items-start gap-2">
                <Heart className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Faith-Friendly Spirituality</h4>
                  <p className="text-xs text-muted-foreground">
                    We honor your spiritual path - whether Christian, Muslim, Buddhist, Hindu, or any tradition. 
                    Your readings can incorporate wisdom from your faith.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
              <p className="text-sm font-semibold text-foreground mb-2">
                🎁 You get <strong>1 FREE reading</strong> to try it out!
              </p>
              <p className="text-xs text-muted-foreground">
                Set up your cosmic profile to unlock ultra-personalized readings that combine all these systems.
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowWelcomeModal(false)}
              className="w-full sm:w-auto"
            >
              Try Basic Reading First
            </Button>
            <Button
              onClick={() => {
                setShowWelcomeModal(false);
                setLocation("/profile");
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Award className="w-4 h-4 mr-2" />
              Set Up My Cosmic Profile
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
