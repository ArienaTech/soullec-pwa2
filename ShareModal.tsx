import { useState } from 'react';
import ShareModal from '../ShareModal';
import { Button } from '@/components/ui/button';

export default function ShareModalExample() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-share">
        Open Share Modal
      </Button>
      <ShareModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        message="The universe whispers to those who listen. Your journey is unfolding exactly as it should."
      />
    </div>
  );
}
