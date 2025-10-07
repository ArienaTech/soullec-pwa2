import EnergyCard from '../EnergyCard';

export default function EnergyCardExample() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <EnergyCard 
        message="The universe whispers to those who listen. Your journey is unfolding exactly as it should. Trust in the divine timing of your life."
        emotion="hopeful"
      />
    </div>
  );
}
