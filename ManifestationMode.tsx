import { useState } from 'react';
import ManifestationMode from '../ManifestationMode';

export default function ManifestationModeExample() {
  const [affirmation, setAffirmation] = useState("");

  return (
    <div className="p-8">
      <ManifestationMode 
        onGenerate={(desire) => {
          console.log('Generating affirmation for:', desire);
          setAffirmation("I am confident, powerful, and worthy of all my desires. My success flows naturally to me. I embrace my divine potential with gratitude.");
        }}
        affirmation={affirmation}
        isLoading={false}
      />
    </div>
  );
}
