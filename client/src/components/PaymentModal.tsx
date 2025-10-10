import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Gem } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "unlock" | "subscription";
  onCheckout: (type: "unlock" | "subscription") => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  type,
  onCheckout,
}: PaymentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {type === "subscription" ? (
              <>
                <Crown className="w-6 h-6 text-yellow-500" />
                Premium Subscription
              </>
            ) : (
              <>
                <Gem className="w-6 h-6 text-blue-500" />
                Purchase Soul Gems
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {type === "subscription"
              ? "Unlock unlimited access to all features"
              : "Get more Soul Gems to continue your spiritual journey"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {type === "subscription" ? (
            <div className="space-y-2">
              <div className="text-3xl font-bold text-center">$9.99/month</div>
              <ul className="space-y-2 text-sm">
                <li>✨ Unlimited Soul Gems</li>
                <li>🔮 All features unlimited</li>
                <li>💎 Priority support</li>
                <li>🎁 Exclusive content</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-2xl font-bold text-center">Soul Gem Packages</div>
              <div className="space-y-2 text-sm">
                <div>💎 5 Gems - $0.99</div>
                <div>💎 20 Gems - $2.99</div>
                <div>💎 50 Gems - $4.99</div>
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={() => onCheckout(type)}
          size="lg"
          className="w-full"
          data-testid="button-payment-checkout"
        >
          Continue to Checkout
        </Button>
      </DialogContent>
    </Dialog>
  );
}
