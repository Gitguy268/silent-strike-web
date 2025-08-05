import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface GameUIProps {
  score: number;
  lives: number;
  currentWeapon: string;
  weapons: string[];
  onWeaponChange: (weapon: string) => void;
  stealthMode: boolean;
  detectionLevel: number;
}

export const GameUI = ({ 
  score, 
  lives, 
  currentWeapon, 
  weapons, 
  onWeaponChange, 
  stealthMode,
  detectionLevel 
}: GameUIProps) => {
  const [showWeaponMenu, setShowWeaponMenu] = useState(false);

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        <div className="bg-stealth/80 backdrop-blur-sm rounded-lg p-4 border border-danger/30">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">SCORE</div>
              <div className="text-xl font-bold text-danger">{score}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">LIVES</div>
              <div className="flex space-x-1">
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < lives ? 'bg-danger' : 'bg-muted/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detection Meter */}
        <div className="bg-stealth/80 backdrop-blur-sm rounded-lg p-4 border border-danger/30">
          <div className="text-xs text-muted-foreground mb-2">DETECTION</div>
          <div className="w-32 h-2 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                detectionLevel > 75 ? 'bg-danger' : 
                detectionLevel > 50 ? 'bg-warning' : 'bg-success'
              }`}
              style={{ width: `${detectionLevel}%` }}
            />
          </div>
          <div className="text-xs mt-1 text-center">
            {detectionLevel > 75 ? 'COMPROMISED' : 
             detectionLevel > 50 ? 'SUSPICIOUS' : 'HIDDEN'}
          </div>
        </div>
      </div>

      {/* Stealth Mode Indicator */}
      {stealthMode && (
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-warning/80 backdrop-blur-sm rounded-lg p-3 border border-warning/50 animate-stealth-glow">
          <div className="text-sm font-bold text-black">STEALTH MODE</div>
          <div className="text-xs text-black/70">Moving silently...</div>
        </div>
      )}

      {/* Weapon Selection */}
      <div className="absolute bottom-20 md:bottom-4 right-4 pointer-events-auto">
        <div className="relative">
          <Button
            onClick={() => setShowWeaponMenu(!showWeaponMenu)}
            className="bg-stealth/80 backdrop-blur-sm border border-danger/30 hover:bg-danger/20 p-4"
          >
            <div className="text-center">
              <div className="text-xs text-muted-foreground">WEAPON</div>
              <div className="text-sm font-bold text-danger">{currentWeapon}</div>
            </div>
          </Button>

          {showWeaponMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-stealth/90 backdrop-blur-sm rounded-lg border border-danger/30 overflow-hidden">
              {weapons.map((weapon) => (
                <Button
                  key={weapon}
                  onClick={() => {
                    onWeaponChange(weapon);
                    setShowWeaponMenu(false);
                  }}
                  variant={weapon === currentWeapon ? "default" : "ghost"}
                  className={`w-full justify-start rounded-none border-none ${
                    weapon === currentWeapon 
                      ? 'bg-danger text-white' 
                      : 'text-danger hover:bg-danger/20'
                  }`}
                >
                  {weapon}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-6 h-6 relative">
          <div className="absolute top-1/2 left-1/2 w-2 h-0.5 bg-danger transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-0.5 h-2 bg-danger transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute inset-0 border border-danger/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};