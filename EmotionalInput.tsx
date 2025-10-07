import EmotionalInput from '../EmotionalInput';

export default function EmotionalInputExample() {
  return (
    <div className="p-8">
      <EmotionalInput 
        onSubmit={(feeling) => console.log('Submitted feeling:', feeling)}
        isLoading={false}
      />
    </div>
  );
}
