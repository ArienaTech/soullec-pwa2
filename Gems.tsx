import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Gem, Crown, ArrowLeft, Sparkles, Check, Copy, Gift, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Currency conversion rates (approximate)
const CURRENCY_RATES: Record<string, { symbol: string; rate: number }> = {
  en: { symbol: "$", rate: 1 },        // USD
  es: { symbol: "$", rate: 1 },        // USD for Spanish
  pt: { symbol: "R$", rate: 5 },       // Brazilian Real
  th: { symbol: "฿", rate: 35 },       // Thai Baht
  zh: { symbol: "¥", rate: 7 },        // Chinese Yuan
  ja: { symbol: "¥", rate: 150 },      // Japanese Yen
  ko: { symbol: "₩", rate: 1350 },     // Korean Won
  fr: { symbol: "€", rate: 0.92 },     // Euro
  de: { symbol: "€", rate: 0.92 },     // Euro
  it: { symbol: "€", rate: 0.92 },     // Euro
  hi: { symbol: "₹", rate: 83 },       // Indian Rupee
};

export default function Gems() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [userId, setUserId] = useState<string | null>(null);
  const [soulGems, setSoulGems] = useState<number>(1);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<{ [key: string]: boolean }>({});
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralCount, setReferralCount] = useState<number>(0);
  const [referralInput, setReferralInput] = useState<string>("");
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);

  const currency = CURRENCY_RATES[language] || CURRENCY_RATES.en;
  
  const formatPrice = (usdPrice: number): string => {
    const convertedPrice = usdPrice * currency.rate;
    return `${currency.symbol}${convertedPrice.toFixed(convertedPrice < 10 ? 2 : 0)}`;
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("manifestly-user-id");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserData(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      generateReferralCode();
    }
  }, [userId]);

  const fetchUserData = async (id: string) => {
    try {
      const response = await apiRequest("GET", `/api/user/profile/${id}`);
      const userData = await response.json();
      setSoulGems(userData.soulGems || 0);
      setIsPremium(userData.subscriptionStatus === "premium");
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const generateReferralCode = async () => {
    if (!userId) return;

    try {
      const response = await apiRequest("GET", `/api/referral/generate/${userId}`);
      const data = await response.json();
      setReferralCode(data.referralCode);
      setReferralCount(data.referralCount || 0);
    } catch (error) {
      console.error("Failed to generate referral code:", error);
      toast({
        title: "Error",
        description: "Failed to generate referral code",
        variant: "destructive",
      });
    }
  };

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const redeemReferralCode = async () => {
    if (!userId || !referralInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a referral code",
        variant: "destructive",
      });
      return;
    }

    setIsRedeeming(true);
    
    try {
      const response = await apiRequest("POST", "/api/referral/redeem", {
        code: referralInput.trim().toUpperCase(),
        userId,
      });
      const data = await response.json();

      if (data.success) {
        setSoulGems(data.soulGems);
        setReferralCount(data.referralCount || 0);
        setReferralInput("");
        toast({
          title: "Success",
          description: data.message,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to redeem referral code",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const handlePurchaseGems = async (tier: "small" | "medium" | "large") => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please return to home and try again",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing({ ...isProcessing, [tier]: true });

    try {
      const response = await apiRequest("POST", "/api/payments/gems", {
        userId,
        tier,
      });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
      setIsProcessing({ ...isProcessing, [tier]: false });
    }
  };

  const handleSubscribe = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please return to home and try again",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing({ ...isProcessing, subscription: true });

    try {
      const response = await apiRequest("POST", "/api/payments/subscription", {
        userId,
      });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
      setIsProcessing({ ...isProcessing, subscription: false });
    }
  };

  const gemTiers = [
    {
      id: "small",
      gems: 5,
      usdPrice: 0.99,
      popular: false,
      savings: null,
    },
    {
      id: "medium",
      gems: 20,
      usdPrice: 2.99,
      popular: true,
      savings: t("savingsMoreGems25"),
    },
    {
      id: "large",
      gems: 50,
      usdPrice: 4.99,
      popular: false,
      savings: t("savingsMoreGems50"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Gem className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {isPremium ? "∞" : soulGems}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Crown className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-serif font-bold text-foreground">{t("unlockUnlimitedGuidance")}</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("unlimitedAccessDesc")}
          </p>
        </div>

        {/* Premium Subscription - Featured */}
        <div className="max-w-3xl mx-auto mb-12">
          <Card className="p-8 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 shadow-xl">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="p-4 rounded-full bg-primary/20">
                <Crown className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-serif font-bold text-foreground">
                      {t("soullecPremium")}
                    </h2>
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      {t("bestValue")}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-lg">
                    {t("unlimitedReadingsAllSystems")}
                  </p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground font-medium">{t("unlimitedGems")} - {t("neverRunOut")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground font-medium">{t("allSixAstrologySystems")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground font-medium">{t("prioritySupport")}</span>
                  </li>
                </ul>

                <div className="flex items-center gap-4 pt-4">
                  <div>
                    <p className="text-4xl font-bold text-foreground">{formatPrice(9.99)}</p>
                    <p className="text-sm text-muted-foreground">{t("perMonth")}</p>
                  </div>
                  <Button
                    onClick={handleSubscribe}
                    disabled={isProcessing.subscription || isPremium}
                    size="lg"
                    className="flex-1"
                    data-testid="button-subscribe-premium"
                  >
                    {isPremium ? t("alreadySubscribed") : isProcessing.subscription ? t("processing") : t("subscribeNow")}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Divider */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-4 text-muted-foreground">{t("orBuyGemsOneTime")}</span>
          </div>
        </div>

        {/* Gem Packs */}
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-2">{t("oneTimeGemPacks")}</h2>
          <p className="text-muted-foreground">{t("perfectForCasualUse")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {gemTiers.map((tier) => (
            <Card
              key={tier.id}
              className={`p-6 relative ${
                tier.popular ? "border-primary shadow-lg" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    {t("mostPopular")}
                  </span>
                </div>
              )}
              {tier.savings && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {tier.savings}
                  </span>
                </div>
              )}
              
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Gem className="w-6 h-6 text-primary" />
                  <span className="text-3xl font-bold text-foreground">{tier.gems}</span>
                </div>
                
                <div>
                  <p className="text-2xl font-bold text-foreground">{formatPrice(tier.usdPrice)}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("oneTimePurchase")}</p>
                </div>

                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{tier.gems} {t("readings")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{t("allFeaturesUnlocked")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{t("neverExpires")}</span>
                  </li>
                </ul>

                <Button
                  onClick={() => handlePurchaseGems(tier.id as "small" | "medium" | "large")}
                  disabled={isProcessing[tier.id]}
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                  data-testid={`button-buy-${tier.id}`}
                >
                  {isProcessing[tier.id] ? t("processing") : t("purchase")}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 mb-2">
                <Gift className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-serif font-bold text-foreground">Get Free Gems!</h3>
              </div>
              <p className="text-muted-foreground">Share your referral code and earn 10 gems per friend. They get 5 gems too!</p>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 rounded-md bg-background border font-mono text-xl font-bold text-center tracking-wider">
                    {referralCode || "Loading..."}
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={copyReferralCode}
                    disabled={!referralCode}
                    data-testid="button-copy-referral"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {referralCount > 0 && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{referralCount} friend{referralCount !== 1 ? 's' : ''} referred</span>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Have a Referral Code?</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={referralInput}
                    onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                    className="flex-1 font-mono"
                    data-testid="input-referral-code"
                  />
                  <Button
                    onClick={redeemReferralCode}
                    disabled={isRedeeming || !referralInput.trim()}
                    data-testid="button-redeem-referral"
                  >
                    {isRedeeming ? "Redeeming..." : "Redeem"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

      </main>
    </div>
  );
}
