import { useState, useCallback } from "react";
import { StartScreen } from "./StartScreen";
import { Game3D } from "./Game3D";
import { GameUI } from "./GameUI";
import { MobileControls } from "./MobileControls";
import { toast } from "sonner";

export const AssassinGame = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [stealthMode, setStealthMode] = useState(false);
  const [detectionLevel, setDetectionLevel] = useState(0);
  const [currentWeapon, setCurrentWeapon] = useState('Knife');
  
  const weapons = ['Knife', 'Silent Pistol', 'Garrote', 'Poison Dart'];

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setDetectionLevel(0);
    setStealthMode(false);
    toast.success("Mission started! Stay hidden and eliminate targets silently.");
  }, []);

  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore);
    if (newScore > 0 && newScore % 500 === 0) {
      toast.success(`Excellent work, Agent! Score: ${newScore}`);
    }
  }, []);

  const handleDetection = useCallback((level: number) => {
    setDetectionLevel(level);
    
    if (level >= 100) {
      setLives(prev => prev - 1);
      setDetectionLevel(0);
      
      if (lives <= 1) {
        setGameState('gameOver');
        toast.error("Mission Failed! You've been compromised.");
      } else {
        toast.error("You've been spotted! Lives remaining: " + (lives - 1));
      }
    } else if (level >= 75) {
      toast.warning("High alert! Find cover immediately!");
    } else if (level >= 50) {
      toast.warning("You're being watched... be careful!");
    }
  }, [lives]);

  const handleMobileMove = useCallback((direction: { x: number; z: number }) => {
    // This would be handled by the Game3D component
    console.log('Mobile move:', direction);
  }, []);

  const handleMobileAttack = useCallback(() => {
    // Trigger attack in 3D game
    console.log('Mobile attack');
    toast.info(`Attack with ${currentWeapon}!`);
  }, [currentWeapon]);

  const handleMobileCrouch = useCallback((crouching: boolean) => {
    setStealthMode(crouching);
    toast.info(crouching ? "Entering stealth mode..." : "Exiting stealth mode...");
  }, []);

  const handleWeaponChange = useCallback((weapon: string) => {
    setCurrentWeapon(weapon);
    toast.info(`Weapon changed to ${weapon}`);
  }, []);

  if (gameState === 'start') {
    return <StartScreen onStart={startGame} />;
  }

  if (gameState === 'gameOver') {
    return (
      <div className="fixed inset-0 bg-gradient-stealth flex items-center justify-center z-50">
        <div className="text-center space-y-6 p-8">
          <h1 className="text-6xl font-comic text-danger">MISSION FAILED</h1>
          <div className="text-xl text-muted-foreground">
            <p>Final Score: <span className="text-danger font-bold">{score}</span></p>
            <p className="text-sm mt-4">The agency will remember your sacrifice...</p>
          </div>
          <button
            onClick={() => setGameState('start')}
            className="px-8 py-4 bg-danger hover:bg-danger/90 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-background relative overflow-hidden">
      {/* 3D Game Canvas */}
      <div className="absolute inset-0">
        <Game3D
          onScoreChange={handleScoreChange}
          onDetection={handleDetection}
          stealthMode={stealthMode}
          currentWeapon={currentWeapon}
        />
      </div>

      {/* Game UI Overlay */}
      <GameUI
        score={score}
        lives={lives}
        currentWeapon={currentWeapon}
        weapons={weapons}
        onWeaponChange={handleWeaponChange}
        stealthMode={stealthMode}
        detectionLevel={detectionLevel}
      />

      {/* Mobile Controls */}
      <MobileControls
        onMove={handleMobileMove}
        onAttack={handleMobileAttack}
        onCrouch={handleMobileCrouch}
      />

      {/* Stealth Mode Instructions */}
      {stealthMode && (
        <div className="fixed top-1/2 right-4 transform -translate-y-1/2 bg-warning/90 backdrop-blur-sm rounded-lg p-4 border border-warning/50 max-w-xs">
          <h3 className="font-bold text-black text-sm mb-2">STEALTH MODE ACTIVE</h3>
          <ul className="text-xs text-black/80 space-y-1">
            <li>• Move slowly behind targets</li>
            <li>• Avoid direct eye contact</li>
            <li>• Strike from behind for silent kills</li>
            <li>• Stay in shadows</li>
          </ul>
        </div>
      )}
    </div>
  );
};