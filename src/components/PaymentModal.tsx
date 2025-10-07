import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, Gem, Check, X } from "lucide-react";
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "unlock" | "subscription";
  onCheckout: (type: "unlock" | "subscription") => void;
}

export default function PaymentModal({ isOpen, onClose, type, onCheckout }: PaymentModalProps) {

  const handleCheckout = () => {
    onCheckout(type);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "subscription" ? (
              <>
                <Crown className="w-5 h-5 text-yellow-500" />
                Premium Subscription
              </>
            ) : (
              <>
                <Gem className="w-5 h-5 text-purple-500" />
                Unlock Reading
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {type === "subscription" ? (
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <Crown className="w-12 h-12 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                    $9.99/month
                  </h3>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Unlimited Access
                  </p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Unlimited Messages
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Unlimited Tarot
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Unlimited Horoscopes
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Premium Support
                  </li>
                </ul>
              </div>
            </Card>
          ) : (
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <Gem className="w-12 h-12 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    $1.99
                  </h3>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    One Time Unlock
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Unlock deeper insight
                </p>
              </div>
            </Card>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleCheckout} className="flex-1">
              {type === "subscription" ? (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Subscribe
                </>
              ) : (
                <>
                  <Gem className="w-4 h-4 mr-2" />
                  Unlock
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}