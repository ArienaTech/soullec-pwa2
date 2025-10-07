import { ThemeProvider } from '../ThemeProvider';

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-8 space-y-4">
        <div className="p-6 bg-card rounded-lg">
          <p className="text-foreground">Theme provider is active. Toggle between light and dark modes.</p>
        </div>
      </div>
    </ThemeProvider>
  );
}
