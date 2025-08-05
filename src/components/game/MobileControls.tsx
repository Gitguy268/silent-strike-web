import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface MobileControlsProps {
  onMove: (direction: { x: number; z: number }) => void;
  onAttack: () => void;
  onCrouch: (crouching: boolean) => void;
}

export const MobileControls = ({ onMove, onAttack, onCrouch }: MobileControlsProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isPressed, setIsPressed] = useState<{[key: string]: boolean}>({});
  const [isCrouching, setIsCrouching] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  const handleTouchStart = (direction: { x: number; z: number }, key: string) => {
    setIsPressed(prev => ({ ...prev, [key]: true }));
    onMove(direction);
  };

  const handleTouchEnd = (key: string) => {
    setIsPressed(prev => ({ ...prev, [key]: false }));
    onMove({ x: 0, z: 0 });
  };

  const toggleCrouch = () => {
    setIsCrouching(!isCrouching);
    onCrouch(!isCrouching);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Movement Controls - Left Side */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <div className="relative w-32 h-32">
          {/* Center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-danger/50 rounded-full"></div>
          
          {/* Up */}
          <Button
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-stealth/80 border border-danger/30 ${
              isPressed.up ? 'bg-danger/50' : ''
            }`}
            onTouchStart={() => handleTouchStart({ x: 0, z: -1 }, 'up')}
            onTouchEnd={() => handleTouchEnd('up')}
            onMouseDown={() => handleTouchStart({ x: 0, z: -1 }, 'up')}
            onMouseUp={() => handleTouchEnd('up')}
          >
            ↑
          </Button>
          
          {/* Down */}
          <Button
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-stealth/80 border border-danger/30 ${
              isPressed.down ? 'bg-danger/50' : ''
            }`}
            onTouchStart={() => handleTouchStart({ x: 0, z: 1 }, 'down')}
            onTouchEnd={() => handleTouchEnd('down')}
            onMouseDown={() => handleTouchStart({ x: 0, z: 1 }, 'down')}
            onMouseUp={() => handleTouchEnd('down')}
          >
            ↓
          </Button>
          
          {/* Left */}
          <Button
            className={`absolute top-1/2 left-0 transform -translate-y-1/2 w-12 h-12 rounded-full bg-stealth/80 border border-danger/30 ${
              isPressed.left ? 'bg-danger/50' : ''
            }`}
            onTouchStart={() => handleTouchStart({ x: -1, z: 0 }, 'left')}
            onTouchEnd={() => handleTouchEnd('left')}
            onMouseDown={() => handleTouchStart({ x: -1, z: 0 }, 'left')}
            onMouseUp={() => handleTouchEnd('left')}
          >
            ←
          </Button>
          
          {/* Right */}
          <Button
            className={`absolute top-1/2 right-0 transform -translate-y-1/2 w-12 h-12 rounded-full bg-stealth/80 border border-danger/30 ${
              isPressed.right ? 'bg-danger/50' : ''
            }`}
            onTouchStart={() => handleTouchStart({ x: 1, z: 0 }, 'right')}
            onTouchEnd={() => handleTouchEnd('right')}
            onMouseDown={() => handleTouchStart({ x: 1, z: 0 }, 'right')}
            onMouseUp={() => handleTouchEnd('right')}
          >
            →
          </Button>
        </div>
      </div>

      {/* Action Controls - Right Side */}
      <div className="absolute bottom-4 right-4 pointer-events-auto space-y-4">
        {/* Attack Button */}
        <Button
          onClick={onAttack}
          className="w-16 h-16 rounded-full bg-danger/80 hover:bg-danger text-white font-bold text-xl shadow-danger"
        >
          🗡️
        </Button>
        
        {/* Crouch Button */}
        <Button
          onClick={toggleCrouch}
          className={`w-16 h-16 rounded-full font-bold text-sm ${
            isCrouching 
              ? 'bg-warning/80 text-black' 
              : 'bg-stealth/80 border border-danger/30 text-danger'
          }`}
        >
          {isCrouching ? 'STEALTH' : 'CROUCH'}
        </Button>
      </div>

      {/* Camera Touch Area - Center */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-stealth/50 rounded-full flex items-center justify-center pointer-events-auto">
        <span className="text-xs text-muted-foreground">Touch to look</span>
      </div>
    </div>
  );
};