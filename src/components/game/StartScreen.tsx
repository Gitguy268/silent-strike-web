import { Button } from "@/components/ui/button";

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="fixed inset-0 bg-gradient-stealth flex items-center justify-center z-50">
      <div className="text-center space-y-8 p-8">
        <div className="relative">
          <h1 className="text-8xl md:text-9xl font-comic text-danger drop-shadow-2xl animate-pulse-danger">
            ASSASSIN
          </h1>
          <div className="absolute inset-0 text-8xl md:text-9xl font-comic text-danger/20 blur-sm animate-stealth-glow">
            ASSASSIN
          </div>
        </div>
        
        <div className="text-xl text-muted-foreground max-w-md mx-auto space-y-2">
          <p>Sneak behind your targets</p>
          <p className="text-danger font-semibold">Eliminate without being seen</p>
          <p className="text-sm text-muted-foreground/70">Avoid detection to complete your mission</p>
        </div>
        
        <Button 
          onClick={onStart}
          size="lg"
          className="text-xl px-12 py-6 bg-danger hover:bg-danger/90 text-white font-bold uppercase tracking-wider shadow-danger transform hover:scale-105 transition-all duration-300"
        >
          Start Mission
        </Button>
        
        <div className="text-sm text-muted-foreground/50 space-y-1">
          <p>WASD / Arrow Keys - Move</p>
          <p>Mouse - Look Around</p>
          <p>Space - Attack</p>
          <p>C - Crouch (Stealth Mode)</p>
        </div>
      </div>
    </div>
  );
};