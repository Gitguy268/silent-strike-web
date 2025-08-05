import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Text } from '@react-three/drei';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Group, Vector3, Euler } from 'three';
import { useFrame } from '@react-three/fiber';

// Pedestrian Component
const Pedestrian = ({ position, onEliminated, onDetected, playerPosition, isStealthMode }: any) => {
  const meshRef = useRef<Group>(null);
  const [isAlive, setIsAlive] = useState(true);
  const [isScreaming, setIsScreaming] = useState(false);
  const [walkDirection, setWalkDirection] = useState(Math.random() * Math.PI * 2);
  const [walkSpeed] = useState(0.5 + Math.random() * 0.5);
  const [detectionRadius] = useState(3 + Math.random() * 2);

  useFrame((state, delta) => {
    if (!meshRef.current || !isAlive) return;

    // Simple AI movement
    const time = state.clock.elapsedTime;
    meshRef.current.position.x += Math.cos(walkDirection + time * 0.1) * walkSpeed * delta;
    meshRef.current.position.z += Math.sin(walkDirection + time * 0.1) * walkSpeed * delta;

    // Keep within bounds
    if (Math.abs(meshRef.current.position.x) > 20) {
      setWalkDirection(walkDirection + Math.PI);
    }
    if (Math.abs(meshRef.current.position.z) > 20) {
      setWalkDirection(walkDirection + Math.PI);
    }

    // Check distance to player
    if (playerPosition) {
      const distance = meshRef.current.position.distanceTo(playerPosition);
      
      // Detection logic
      if (distance < detectionRadius && !isStealthMode) {
        if (distance < 1.5 && !isScreaming) {
          setIsScreaming(true);
          onDetected();
          setTimeout(() => setIsScreaming(false), 2000);
        }
      }
    }

    // Rotate to face movement direction
    meshRef.current.rotation.y = walkDirection + time * 0.1;
  });

  const eliminate = () => {
    if (isAlive && !isScreaming) {
      setIsAlive(false);
      onEliminated();
    }
  };

  if (!isAlive) {
    return (
      <group position={position}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[1, 0.2, 2]} />
          <meshStandardMaterial color="#8B0000" />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={meshRef} position={position} onClick={eliminate}>
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.8, 2, 0.4]} />
        <meshStandardMaterial color={isScreaming ? "#ff0000" : "#4a5568"} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="#d69e2e" />
      </mesh>

      {/* Scream effect */}
      {isScreaming && (
        <Text
          position={[0, 3, 0]}
          fontSize={0.5}
          color="red"
          anchorX="center"
          anchorY="middle"
        >
          AHHH!
        </Text>
      )}
    </group>
  );
};

// Environment Component
const GameEnvironment = () => {
  return (
    <>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>

      {/* Buildings */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 40,
            Math.random() * 3 + 2,
            (Math.random() - 0.5) * 40
          ]}
        >
          <boxGeometry args={[3, Math.random() * 4 + 2, 3]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
      ))}

      {/* Street lights */}
      {Array.from({ length: 12 }, (_, i) => (
        <group
          key={i}
          position={[
            (Math.random() - 0.5) * 45,
            0,
            (Math.random() - 0.5) * 45
          ]}
        >
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 5]} />
            <meshStandardMaterial color="#718096" />
          </mesh>
          <pointLight position={[0, 4.5, 0]} intensity={0.5} color="#ffd700" distance={8} />
        </group>
      ))}
    </>
  );
};

// Player Component
const Player = ({ position, onMove, stealthMode }: any) => {
  const meshRef = useRef<Group>(null);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(position);
    }
  }, [position]);

  return (
    <group ref={meshRef}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.6, 1.8, 0.3]} />
        <meshStandardMaterial color={stealthMode ? "#2d3748" : "#4299e1"} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.25]} />
        <meshStandardMaterial color="#d69e2e" />
      </mesh>

      {/* Stealth indicator */}
      {stealthMode && (
        <mesh position={[0, 2.8, 0]}>
          <ringGeometry args={[0.4, 0.5, 8]} />
          <meshStandardMaterial color="#38a169" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

interface Game3DProps {
  onScoreChange: (score: number) => void;
  onDetection: (level: number) => void;
  stealthMode: boolean;
  currentWeapon: string;
}

export const Game3D = ({ onScoreChange, onDetection, stealthMode, currentWeapon }: Game3DProps) => {
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(new Vector3(0, 0, 0));
  const [detectionLevel, setDetectionLevel] = useState(0);
  const cameraRef = useRef<any>();

  // Generate pedestrians
  const pedestrians = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 30,
        0,
        (Math.random() - 0.5) * 30
      ]
    }));
  }, []);

  const handleElimination = () => {
    const newScore = score + 100;
    setScore(newScore);
    onScoreChange(newScore);
  };

  const handleDetection = () => {
    const newLevel = Math.min(100, detectionLevel + 25);
    setDetectionLevel(newLevel);
    onDetection(newLevel);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const moveSpeed = stealthMode ? 0.1 : 0.2;
      const newPosition = playerPosition.clone();

      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          newPosition.z -= moveSpeed;
          break;
        case 's':
        case 'arrowdown':
          newPosition.z += moveSpeed;
          break;
        case 'a':
        case 'arrowleft':
          newPosition.x -= moveSpeed;
          break;
        case 'd':
        case 'arrowright':
          newPosition.x += moveSpeed;
          break;
      }

      setPlayerPosition(newPosition);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPosition, stealthMode]);

  // Reduce detection over time
  useEffect(() => {
    const interval = setInterval(() => {
      setDetectionLevel(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Canvas shadows className="w-full h-full">
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[playerPosition.x, playerPosition.y + 5, playerPosition.z + 8]}
        fov={75}
      />
      
      <OrbitControls
        target={[playerPosition.x, playerPosition.y + 1, playerPosition.z]}
        enablePan={false}
        enableZoom={true}
        maxDistance={15}
        minDistance={3}
        maxPolarAngle={Math.PI / 2.2}
      />

      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      <Environment preset="night" />

      <GameEnvironment />
      
      <Player 
        position={playerPosition} 
        stealthMode={stealthMode}
      />

      {pedestrians.map((pedestrian) => (
        <Pedestrian
          key={pedestrian.id}
          position={pedestrian.position}
          onEliminated={handleElimination}
          onDetected={handleDetection}
          playerPosition={playerPosition}
          isStealthMode={stealthMode}
        />
      ))}
    </Canvas>
  );
};
