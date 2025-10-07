import { useState } from 'react';
import PaymentModal from '../PaymentModal';
import { Button } from '@/components/ui/button';

export default function PaymentModalExample() {
  const [isOpen, setIsOpen] = useState(true);
  const [type, setType] = useState<"unlock" | "subscription">("unlock");

  return (
    <div className="p-8 space-y-4">
      <div className="flex gap-4">
        <Button onClick={() => { setType("unlock"); setIsOpen(true); }} data-testid="button-open-unlock">
          Open Unlock Modal
        </Button>
        <Button onClick={() => { setType("subscription"); setIsOpen(true); }} data-testid="button-open-subscription">
          Open Subscription Modal
        </Button>
      </div>
      <PaymentModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        type={type}
        onCheckout={(t) => console.log('Checkout:', t)}
      />
    </div>
  );
}
