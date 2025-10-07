import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/lib/use-toast";
import { useAuth } from "@/lib/useAuth";
import { ArrowLeft, Save, Sparkles, Crown, LogIn } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";

const RELIGIONS = [
  "None",
  "Buddhism",
  "Christianity",
  "Hinduism",
  "Islam",
  "Judaism",
  "Taoism",
  "Spirituality (Non-religious)",
  "Other"
];


export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    religion: "",
    horoscopePreferences: [] as string[]
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("manifestly-user-id");
    setUserId(storedUserId);

    if (storedUserId) {
      fetch(`/api/user/profile/${storedUserId}`)
        .then(res => res.json())
        .then(user => {
          setFormData({
            birthDate: user.birthDate || "",
            birthTime: user.birthTime || "",
            birthPlace: user.birthPlace || "",
            religion: user.religion || "",
            horoscopePreferences: user.horoscopePreferences || []
          });
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleHoroscopeToggle = (preference: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      horoscopePreferences: checked
        ? [...prev.horoscopePreferences, preference]
        : prev.horoscopePreferences.filter(p => p !== preference)
    }));
  };

  const handleSave = async () => {
    if (!userId) {
      toast({
        title: t("error"),
        description: t("sessionNotFound"),
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const response = await apiRequest("POST", "/api/user/profile", {
        userId,
        ...formData
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: t("profileSaved"),
          description: t("profileSavedDesc"),
        });
        setLocation("/");
      } else {
        throw new Error(data.message || t("failedToSaveProfile"));
      }
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || t("failedToSaveProfile"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container max-w-2xl mx-auto p-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("backToHome")}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t("cosmicProfile")}
            </CardTitle>
            <CardDescription>
              {t("profileSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">{t("birthInformation")}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="birthDate">{t("birthDate")}</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                  data-testid="input-birth-date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthTime">{t("birthTime")}</Label>
                <Input
                  id="birthTime"
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                  data-testid="input-birth-time"
                />
                <p className="text-xs text-muted-foreground">
                  {t("baziAccuracy")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthPlace">{t("birthPlace")}</Label>
                <Input
                  id="birthPlace"
                  type="text"
                  placeholder={t("birthPlacePlaceholder")}
                  value={formData.birthPlace}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthPlace: e.target.value }))}
                  data-testid="input-birth-place"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">{t("astrologyPreferences")}</h3>
              <p className="text-xs text-muted-foreground">
                {t("astrologyPreferencesDesc")}
              </p>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="western-zodiac"
                    checked={formData.horoscopePreferences.includes('western-zodiac')}
                    onCheckedChange={(checked) => handleHoroscopeToggle('western-zodiac', checked as boolean)}
                    data-testid="checkbox-western-zodiac"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="western-zodiac" className="cursor-pointer">
                      {t("westernZodiac")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("westernZodiacDesc")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="vedic"
                    checked={formData.horoscopePreferences.includes('vedic')}
                    onCheckedChange={(checked) => handleHoroscopeToggle('vedic', checked as boolean)}
                    data-testid="checkbox-vedic"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="vedic" className="cursor-pointer">
                      {t("vedicAstrology")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("vedicAstrologyDesc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="thai-lanna"
                    checked={formData.horoscopePreferences.includes('thai-lanna')}
                    onCheckedChange={(checked) => handleHoroscopeToggle('thai-lanna', checked as boolean)}
                    data-testid="checkbox-thai-lanna"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="thai-lanna" className="cursor-pointer">
                      {t("thaiLannaAstrology")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("thaiLannaAstrologyDesc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="chinese-bazi"
                    checked={formData.horoscopePreferences.includes('chinese-bazi')}
                    onCheckedChange={(checked) => handleHoroscopeToggle('chinese-bazi', checked as boolean)}
                    data-testid="checkbox-chinese-bazi"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="chinese-bazi" className="cursor-pointer">
                      {t("chineseBazi")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("chineseBaziDesc")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="japanese"
                    checked={formData.horoscopePreferences.includes('japanese')}
                    onCheckedChange={(checked) => handleHoroscopeToggle('japanese', checked as boolean)}
                    data-testid="checkbox-japanese"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="japanese" className="cursor-pointer">
                      {t("japaneseAstrology")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("japaneseAstrologyDesc")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="korean-saju"
                    checked={formData.horoscopePreferences.includes('korean-saju')}
                    onCheckedChange={(checked) => handleHoroscopeToggle('korean-saju', checked as boolean)}
                    data-testid="checkbox-korean-saju"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="korean-saju" className="cursor-pointer">
                      {t("koreanSaju")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("koreanSajuDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">{t("spiritualPath")}</h3>
              
              <div className="space-y-2">
                <Label htmlFor="religion">{t("religionSpirituality")}</Label>
                <Select
                  value={formData.religion}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, religion: value }))}
                >
                  <SelectTrigger id="religion" data-testid="select-religion">
                    <SelectValue placeholder={t("selectSpiritualPath")} />
                  </SelectTrigger>
                  <SelectContent>
                    {RELIGIONS.map(religion => (
                      <SelectItem key={religion} value={religion}>
                        {religion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {t("wisdomRespect")}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-sm font-semibold text-foreground">{t("account")}</h3>
              
              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{(user as any).email || t("signedIn")}</p>
                      <p className="text-xs text-muted-foreground">
                        {(user as any).subscriptionStatus === "premium" ? t("premiumUnlimitedGems") : t("freeAccount")}
                      </p>
                    </div>
                    {(user as any).subscriptionStatus === "premium" && (
                      <Crown className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  {(user as any).subscriptionStatus !== "premium" && (
                    <Button
                      onClick={() => {
                        window.location.href = "/api/payments/subscription";
                      }}
                      className="w-full"
                      variant="default"
                      data-testid="button-subscribe-premium"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      {t("upgradeToPremium")}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {t("signInForPremium")}
                  </p>
                  <Button
                    onClick={() => {
                      window.location.href = "/api/login";
                    }}
                    className="w-full"
                    variant="secondary"
                    data-testid="button-login-for-premium"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {t("signInForPremiumButton")}
                  </Button>
                </div>
              )}
            </div>

            <Button
              onClick={handleSave}
              disabled={saving || !formData.birthDate}
              className="w-full"
              data-testid="button-save-profile"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? t("saving") : t("saveCosmicProfile")}
            </Button>

            {!formData.birthDate && (
              <p className="text-xs text-center text-muted-foreground">
                {t("birthDateRequired")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
